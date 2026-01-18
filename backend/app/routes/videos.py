import uuid
from app.core.config import settings
from app.database.config import get_db
from app.database.models import Video
from app.services.celery_client import celery_client
from app.services.storage import get_s3_client
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.database.schema import UploadVideoResponse, VideoResponse
from sqlalchemy import  or_

from app.database.enums import VideoStatus

router = APIRouter()



@router.post("/upload",response_model=UploadVideoResponse)
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    1. Validates file type.
    2. Uploads to MinIO.
    3. Returns the filename.
    """
    if file.content_type not in ["video/mp4", "video/mpeg"]:
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only MP4 allowed."
        )

    # 2. Generate a unique name (prevent overwriting)
    # user_upload.mp4 -> distinct_uuid_user_upload.mp4
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    client = get_s3_client()
    try:
        # We use upload_fileobj because 'file.file' is a stream
        client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": file.content_type},
        )
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to upload video to storage."
        )

    new_video = Video(
        id=unique_filename, title=file.filename, s3_key=unique_filename,status=VideoStatus.PROCESSING.value
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    # Trigger the background job
    # We use .send_task() because the Worker code is in a different container
    task = celery_client.send_task(
        "process_video",  # The name must match EXACTLY what is in the Worker
        args=[unique_filename],
    )
    return {
        "video_data": new_video,
        "task_id": task.id,
        "message": "Video uploaded successfully. Processing started.",
    }


    
@router.get("/videos", response_model=list[VideoResponse])
def get_videos(
    search: str = None,  
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(Video)
    
    if search:
        # The Magic Logic:
        # Search inside the TITLE OR inside the TRANSCRIPT
        # 'ilike' makes it Case-Insensitive (User types "budget", matches "Budget")
        search_filter = or_(
            Video.title.ilike(f"%{search}%"),
            Video.transcript.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Always sort by newest first
    return query.order_by(Video.created_at.desc()).limit(limit).all()

@router.get("/videos/{video_id}",response_model=VideoResponse)
def get_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.get("/videos/{video_id}/url")
def get_video_url(video_id: str, db: Session = Depends(get_db)):
    """
    Generates a secure, temporary link to the video file.
    - Local: Returns http://localhost:9000/...
    - Prod: Returns https://s3.us-west-004.backblazeb2.com/...
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    try:
        # 1. Generate the signed URL (valid for 1 hour)
        client = get_s3_client()
        url = client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.AWS_BUCKET_NAME, 'Key': video.s3_key},
            ExpiresIn=3600 
        )
        
        # 2. THE LOCALHOST FIX (Crucial for MinIO)
        # We check an env var to see if we are in 'development' mode
        if settings.ENVIRONMENT == "development":
            # Docker sees 'minio:9000', but browser needs 'localhost:9000'
            if "minio:9000" in url:
                url = url.replace("minio:9000", "localhost:9000")
            
        return {"url": url}
        
    except Exception as e:
        print(f"Error generating URL: {e}")
        raise HTTPException(status_code=500, detail="Could not generate video URL")

@router.delete("/videos/{video_id}")
async def delete_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Video not found")
    try:
        client=get_s3_client()
        client.delete_object(Bucket=settings.AWS_BUCKET_NAME, Key=video.s3_key)
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
