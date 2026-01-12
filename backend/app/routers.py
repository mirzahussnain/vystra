import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.celery_client import celery_client
from app.storage import BUCKET_NAME, get_s3_client

router = APIRouter()


@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
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
