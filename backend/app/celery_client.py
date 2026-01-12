import os
from celery import Celery

# Get Redis URL from environment
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# Initialize the "Sender"
celery_client = Celery(
    "insightstream_sender",
    broker=REDIS_URL,
    backend=REDIS_URL
)