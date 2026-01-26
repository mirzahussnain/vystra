import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, update
from sqlalchemy.orm import Session

from ..core.config import settings
from ..database.config import get_db
from ..database.enums import VideoStatus
from ..database.models import User, Video
from ..database.schema import (
    PresignedUrlRequest,
    PresignedUrlResponse,
    VideoResponse,
)
from ..dependencies import get_current_user, require_storage_quota
from ..services.celery_client import celery_client
from ..services.storage import get_s3_client

router = APIRouter()


# @router.post("/upload",response_model=UploadVideoResponse)
# def upload_file(file: UploadFile = File(...),

#     user: User = Depends(require_storage_quota),
#     db: Session = Depends(get_db)):
#     """
#     1. Validates User
#     2. Validates file type.
#     3. Uploads to MinIO.
#     4. Returns the filename.
#     """
#     if file.content_type not in ["video/mp4", "video/mpeg"]:
#         raise HTTPException(
#             status_code=400, detail="Invalid file type. Only MP4 allowed."
#      )
#      # 1. Validate File Size explicitly (Double check)
#    # Seek to end to get real size if needed, or rely on Content-Length
#     file.file.seek(0, 2)
#     file_size = file.file.tell()
#     file.file.seek(0) # Reset cursor

#     # 2. Generate a unique name (prevent overwriting)
#     # user_upload.mp4 -> distinct_uuid_user_upload.mp4
#     file_extension = file.filename.split(".")[-1]
#     unique_filename = f"{uuid.uuid4()}.{file_extension}"

#     client = get_s3_client()
#     try:
#         # We use upload_fileobj because 'file.file' is a stream
#         client.upload_fileobj(
#             file.file,
#             settings.AWS_BUCKET_NAME,
#             unique_filename,
#             ExtraArgs={"ContentType": file.content_type},
#         )
#         user.used_storage_bytes += file_size
#     except Exception as e:
#         print(f"Upload Error: {e}")
#         raise HTTPException(
#             status_code=500, detail="Failed to upload video to storage."
#         )

#     new_video = Video(
#         id=unique_filename, title=file.filename, s3_key=unique_filename,status=VideoStatus.PROCESSING.value,file_size=file_size,user_id=user.id
#     )
#     db.add(new_video)
#     db.commit()
#     db.refresh(new_video)
#     # Trigger the background job
#     # We use .send_task() because the Worker code is in a different container
#     task = celery_client.send_task(
#         "process_video",  # The name must match EXACTLY what is in the Worker
#         args=[unique_filename],
#     )
#     return {
#         "video_data": new_video,
#         "task_id": task.id,
#         "message": "Video uploaded successfully. Processing started.",
#     }


@router.post("/upload-url", response_model=PresignedUrlResponse)
def generate_upload_url(
    req: PresignedUrlRequest,
    user: User = Depends(require_storage_quota),
    db: Session = Depends(get_db),
):
    # 1. Validation
    if req.content_type not in ["video/mp4", "video/mpeg","video/quicktime"]:
        raise HTTPException(status_code=400, detail="Invalid file type.")

    # 2. Check if user has enough space (Prevent abuse)
    if user.used_storage_bytes + req.file_size > user.max_storage_bytes:
        raise HTTPException(status_code=403, detail="Storage quota exceeded.")

    # 3. Generate IDs
    video_uuid = str(uuid.uuid4())
    ext = "mp4" if req.content_type == "video/mp4" else "mpeg"
    s3_key = f"uploads/{user.id}/{video_uuid}.{ext}"

    # 4. Generate Presigned URL (The Magic)
    s3_client = get_s3_client(True)
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_BUCKET_NAME,
                "Key": s3_key,
                "ContentType": req.content_type,
            },
            ExpiresIn=300,  # URL valid for 5 minutes
        )

    except Exception as e:
        print(f"AWS Error: {e}")
        raise HTTPException(status_code=500, detail="Could not generate upload URL.")

    # 5. Create "Pending" DB Entry
    # We create the row NOW so we can track "Ghost Uploads" (started but never finished)
    new_video = Video(
        id=video_uuid,
        title=req.filename,
        s3_key=s3_key,
        file_size=req.file_size,
        status=VideoStatus.PENDING,
        user_id=user.id,
    )
    db.add(new_video)
    db.commit()

    return {"upload_url": presigned_url, "video_id": video_uuid, "s3_key": s3_key}


@router.post("/{video_id}/confirm-upload")
def confirm_upload(
    video_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    video = (
        db.query(Video).filter(Video.id == video_id, Video.user_id == user.id).first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    if video.status != VideoStatus.PENDING:
        return {"status": "Already processing", "task_id": None}
    # 1. Verify file actually exists in S3 (Optional but recommended)
    s3_client = get_s3_client(False)
    try:
        s3_client.head_object(Bucket=settings.AWS_BUCKET_NAME, Key=video.s3_key)

    except Exception:
        # If S3 returns 404, we throw an error here.
        # This prevents the worker from crashing later!
        raise HTTPException(
            status_code=400, detail="Upload not found. Please try uploading again."
        )
    # 2. Update Status
    try:
        # 1. Update User Storage (Atomic)
        user_stmt = (
            update(User)
            .where(User.id == user.id)
            .values(used_storage_bytes=User.used_storage_bytes + video.file_size)
        )

        # 2. Update Video Status
        video_stmt = (
            update(Video)
            .where(Video.id == video_id, Video.status == VideoStatus.PENDING)
            .values(status=VideoStatus.PROCESSING)
        )

        db.execute(user_stmt)
        db.execute(video_stmt)
        db.commit()

        # 3. Trigger Worker
        task = celery_client.send_task("process_video", args=[video.id])

        return {"status": "Processing started", "task_id": task.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to update video status: {str(e)}"
        )


@router.get("/videos", response_model=list[VideoResponse])
def get_videos(
    search: str = None,
    limit: int = 100,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get ONLY the logged-in user's videos.
    """
    query = db.query(Video).filter(Video.user_id == user.id)

    if search:
        # The Magic Logic:
        # Search inside the TITLE OR inside the TRANSCRIPT
        # 'ilike' makes it Case-Insensitive (User types "budget", matches "Budget")
        search_filter = or_(
            Video.title.ilike(f"%{search}%"), Video.transcript.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    # Always sort by newest first
    return query.order_by(Video.created_at.desc()).limit(limit).all()


@router.get("/videos/{video_id}", response_model=VideoResponse)
def get_video(
    video_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    video = (
        db.query(Video).filter(Video.user_id == user.id, Video.id == video_id).first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@router.get("/videos/{video_id}/url")
def get_video_url(
    video_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Returns the video URL.
    - If R2_PUBLIC_URL is set (Prod), returns the direct public link (Free egress).
    - If not set (Local), generates a temporary signed URL for MinIO.
    """
    video = (
        db.query(Video).filter(Video.id == video_id, Video.user_id == user.id).first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    # 2. CHECK: Does the file actually exist? (Instead of blocking based on status)
    if not video.s3_key:
        raise HTTPException(status_code=400, detail="Video has not been uploaded yet")

    # If we have a public R2 domain, use it! It's faster and free.
    public_domain = settings.R2_PUBLIC_URL
    if public_domain:
        # Ensure no double slashes (e.g. domain.com//uploads)
        if public_domain.endswith("/"):
            public_domain = public_domain[:-1]
        
        return {"url": f"{public_domain}/{video.s3_key}"}
    try:
        # is_dev = settings.ENVIRONMENT == "development"
        # signing_url = "http://localhost:9000" if is_dev else settings.AWS_ENDPOINT_URL
        client = get_s3_client(settings.AWS_ENDPOINT_URL)
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.AWS_BUCKET_NAME, "Key": video.s3_key},
            ExpiresIn=3600,
        )

        if settings.ENVIRONMENT == "development":
            url = url.replace(settings.AWS_ENDPOINT_URL, "http://localhost:9000")

        print("Generated URL:", url)
        return {"url": url}

    except Exception as e:
        print(f"Error generating URL: {e}")
        raise HTTPException(status_code=500, detail="Could not generate video URL")


@router.delete("/videos/{video_id}")
async def delete_video(
    video_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    video = (
        db.query(Video).filter(Video.id == video_id, Video.user_id == user.id).first()
    )
    if video is None:
        raise HTTPException(status_code=404, detail="Video not found")
    try:
        if video.s3_key:
            client = get_s3_client()
            client.delete_object(Bucket=settings.AWS_BUCKET_NAME, Key=video.s3_key)

        file_size_bytes = video.file_size or 0
        # Subtract size from user usage
        user.used_storage_bytes -= file_size_bytes

        # Safety Net: Prevent negative storage numbers
        if user.used_storage_bytes < 0:
            user.used_storage_bytes = 0
        db.add(user)
        db.delete(video)
        db.commit()
        return {"success": True, "message": "Video deleted successfully"}
    except Exception as e:
        print(f"Error deleting video from S3: {e}")
        raise HTTPException(status_code=500, detail="Could not delete video from S3")


# @router.delete("/videos/")
# def update_video(video_id:str,title:str,db:Session=Depends(get_db)):
#     video=db.query(models.Video).filter(models.Video.id==video_id).first()
#     if video is None:
#         raise HTTPException(status_code=404,detail="Video not found")

#     video.title=title
#     db.commit()
#     db.refresh(video)
#     return video

# @router.get("/search")
# async def search_videos(
#     query: str = Query(..., min_length=3), db: Session = Depends(get_db)
# ):
#     # Search for videos where the transcript contains the query string
#     # ilike = Case Insensitive Like (e.g., "Desire" finds "desire")
#     results = (
#         db.query(models.Video).filter(models.Video.transcript.ilike(f"%{query}%")).all()
#     )

#     if not results:
#         return {"message": "No matches found.", "results": []}

#     return {"count": len(results), "query": query, "results": results}
