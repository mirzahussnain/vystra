from celery import Celery
from app.core.config import settings

# Get Redis URL from environment


# Initialize the "Sender"
celery_client = Celery(
    "insightstream_sender",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)