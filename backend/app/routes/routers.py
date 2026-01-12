import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.services.celery_client import celery_client
from app.services.storage import   get_s3_client
from app.models import models
from app.database.database import get_db

router = APIRouter()

BUCKET_NAME=settings._aws_bucket_name

@router.post("/upload")
def upload_file(file: UploadFile = File(...),db:Session=Depends(get_db)):
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
            id=unique_filename,
            title=file.filename,
            s3_key=unique_filename
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
