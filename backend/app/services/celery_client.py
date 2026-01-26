from celery import Celery
from ..core.config import settings

# Get Redis URL from environment


# Initialize the "Sender"
celery_client = Celery(
    "vystra_sender",
    broker=settings.BROKER_URL,
    backend=settings.REDIS_URL
)

# 👇 ADD THIS BLOCK TO STOP THE SPAM 👇
celery_client.conf.update(
    # 1. Stop it from looking for other workers (Gossip)
    worker_enable_remote_control=False,
    worker_mingle=False,
    worker_gossip=False,
    
    # 2. Reduce Heartbeats (checks connection less often)
    broker_heartbeat=120,
    
    # 3. CRITICAL for "Producer Only" mode:
    # If your backend NEVER processes tasks itself (it only sends them),
    # tell it to stop acting like a worker candidate.
    worker_direct=False,
)