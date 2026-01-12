import uuid

from app.core.config import settings
from app.database.database import get_db
from app.models import models
from app.services.celery_client import celery_client
from app.services.storage import get_s3_client
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

router = APIRouter()

BUCKET_NAME = settings._aws_bucket_name


@router.post("/upload")
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
            BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": file.content_type},
        )
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to upload video to storage."
        )

    new_video = models.Video(
        id=unique_filename, title=file.filename, s3_key=unique_filename
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
        "status": "queued",
        "video_id": unique_filename,
        "task_id": task.id,
        "message": "Video uploaded successfully. Processing started.",
    }


@router.get("/search")
async def search_videos(
    query: str = Query(..., min_length=3), db: Session = Depends(get_db)
):
    # Search for videos where the transcript contains the query string
    # ilike = Case Insensitive Like (e.g., "Desire" finds "desire")
    results = (
        db.query(models.Video).filter(models.Video.transcript.ilike(f"%{query}%")).all()
    )

    if not results:
        return {"message": "No matches found.", "results": []}

    return {"count": len(results), "query": query, "results": results}
