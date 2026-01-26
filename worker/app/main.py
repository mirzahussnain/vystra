import ssl

from celery.schedules import crontab

from .core.config import settings
from .services.celery_client import celery_app

broker_url = settings.BROKER_URL
backend_url = settings.REDIS_URL

if broker_url.startswith("amqps://"):
    # RabbitMQ just needs a boolean for SSL in most cloud setups
    celery_app.conf.broker_use_ssl = True

# 🧠 Redis (Result Backend) SSL Setup
if backend_url.startswith("rediss://"):
    # Redis still needs the specific CERT_NONE flag for Upstash
    celery_app.conf.redis_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_NONE}

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
    worker_enable_remote_control=False,
    worker_mingle=False,
    worker_gossip=False,
    broker_heartbeat=120,
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
