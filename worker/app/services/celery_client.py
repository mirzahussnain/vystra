from celery import Celery
from worker.app.core.config import settings

# 2. Create the App

celery_app = Celery(
    "vystra_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL
)

