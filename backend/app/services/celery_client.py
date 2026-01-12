from celery import Celery
from app.core.config import settings

# Get Redis URL from environment
REDIS_URL = settings._redis_url

# Initialize the "Sender"
celery_client = Celery(
    "insightstream_sender",
    broker=REDIS_URL,
    backend=REDIS_URL
)