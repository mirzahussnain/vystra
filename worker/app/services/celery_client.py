import os

from celery import Celery
from celery.schedules import crontab
from worker.app.core.config import settings

# 2. Create the App

celery_app = Celery(
    "insightstream_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL
)

