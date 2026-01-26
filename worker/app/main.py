

import ssl
from celery.schedules import crontab
from .services.celery_client import celery_app
from .core.config import settings


if settings.REDIS_URL and settings.REDIS_URL.startswith("rediss://"):
    celery_app.conf.update(
        broker_use_ssl={
            "ssl_cert_reqs": ssl.CERT_NONE
        },
        redis_backend_use_ssl={
            "ssl_cert_reqs": ssl.CERT_NONE
        }
    )
celery_app.conf.update(
    imports=["worker.app.tasks.billing", "worker.app.tasks.video_processing"],
    # Prevents the worker from grabbing 4 videos at once and running out of RAM.
    worker_prefetch_multiplier=1,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    task_time_limit=300 * 60,  # Hard limit: 5 hours (AI is slow)
    # If the worker crashes mid-task, the job is not lost; Redis sends it to another worker.
    task_acks_late=True,
    beat_schedule={
        "reset-quotas-daily": {
            "task": "reset_monthly_quotas",
            # Run at 00:00 (Midnight) UTC every day
            "schedule": crontab(minute=0, hour=0),
        },
    },
    timezone="UTC",
    broker_connection_retry_on_startup=True,
)
