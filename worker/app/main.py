import os
import time

from celery import Celery

# configure Celery to use Redis as the broker
redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery("insightstream_worker", broker=redis_url, backend=redis_url)


@celery_app.task(name="process_video")
def process_video_task(video_id: str):
    """
    This function runs in the Background Worker.
    It receives the 'video_id' from the API.
    """
    print(f"🎬 STARTED: Processing video {video_id}...")

    # Simulate heavy AI work (we will add real AI in the next step)
    time.sleep(5)

    print(f"✅ FINISHED: Video {video_id} processed successfully!")
    return {"status": "completed", "video_id": video_id}
