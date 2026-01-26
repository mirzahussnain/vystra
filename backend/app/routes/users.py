from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.routes.payments import create_checkout_session

from ..core.config import settings
from ..database.config import SessionLocal, get_db
from ..database.enums import PlanType
from ..database.models import User, Video
from ..database.schema import UserCreate  # Defined in previous step
from ..dependencies import get_current_user

router = APIRouter()

# Only allow requests with a secret key
ADMIN_SECRET = settings.ADMIN_SECRET_KEY


@router.get("/videos/stats")
def get_dashboard_stats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # 1. Total Videos
    total_videos = db.query(Video).filter(Video.user_id == user.id).count()

    storage_used_gb = user.used_storage_bytes / (1024 * 1024 * 1024)

    storage_percent = (
        (user.used_storage_bytes / user.max_storage_bytes) * 100
        if user.max_storage_bytes
        else 0
    )
    minutes_percent = (
        (user.used_minutes / user.max_minutes) * 100 if user.max_minutes else 0
    )

    # 2. Videos from last 7 days (for the "+2 from last week" badge)
    seven_days_ago = datetime.now(timezone.utc) + timedelta(days=30) - timedelta(days=7)
    recent_videos = (
        db.query(Video)
        .filter(Video.user_id == user.id, Video.created_at >= seven_days_ago)
        .count()
    )

  

    return {
        "total_videos": total_videos,
        "recent_videos": recent_videos,
        "storage_used": user.used_storage_bytes, # Send RAW integer (e.g. 256000000)
        "storage_limit": user.max_storage_bytes,
        "storage_percent": round(storage_percent, 1),
        "minutes_used": round(user.used_minutes, 1),
        "minutes_limit": user.max_minutes,
        "minutes_percent": round(minutes_percent, 1),
        "ai_score": user.used_ai_actions,
        "ai_limit": user.max_ai_actions,
    }


# @router.post("/users/sync")
# def sync_user(
#     user_data: UserCreate,
#     x_admin_secret: str = Header(None),  # Get secret from header
#     db: Session = Depends(get_db),
# ):
#     # 1. Verify it's coming from Next.js app
#     if x_admin_secret != ADMIN_SECRET:
#         raise HTTPException(status_code=403, detail="Unauthorized")

#     # 2. Check if user already exists (Idempotency)
#     existing_user = db.query(User).filter(User.id == user_data.id).first()
#     if existing_user:
#         return {"message": "User already exists"}

#     # 3. Create new user with default FREE plan
#     new_user = User(
#         id=user_data.id,
#         email=user_data.email,
#         first_name=user_data.first_name,
#         last_name=user_data.last_name,
#         plan=PlanType.FREE.value,  # Default to Free
#     )
    
#     try:
#             db.add(new_user)
#             db.commit()
#             db.refresh(new_user)
#             return {"message": "User synced successfully", "user_id": new_user.id}
    
#     except IntegrityError:
#             # 🛡️ THE FIX: Handle the Race Condition
#             db.rollback()
#             return {"message": "User already exists (race condition handled)"}


@router.get("/users/me/usage")
def get_user_usage(user: User = Depends(get_current_user)):
    """
    Returns a comprehensive usage report for the Dashboard.
    Tracks: Storage (MB), Processing (Minutes), and AI (Requests).
    """
    with SessionLocal() as db:
        def calc_percent(used, limit):
            if limit <= 0:
                return 100
            return min((used / limit) * 100, 100)
            
        total_videos = db.query(Video).filter(Video.user_id == user.id).count()
        return {
            "id": user.id,
            "plan": user.plan.value if hasattr(user.plan, "value") else user.plan,
            "total_videos": total_videos,
            # 1. Storage Quota (Bytes) - "Hard Limit"
            # Used for preventing new uploads
            "storage": {
                "used_bytes": user.used_storage_bytes,
                "limit_bytes": user.max_storage_bytes,
                "percent": calc_percent(user.used_storage_bytes, user.max_storage_bytes),
                "is_full": user.used_storage_bytes >= user.max_storage_bytes,
            },
            # 2. Processing Quota (Minutes) - "Soft Limit"
            # Used for video length allowance
            "processing": {
                "used_minutes": user.used_minutes,
                "limit_minutes": user.max_minutes,
                "percent": calc_percent(user.used_minutes, user.max_minutes),
                "is_full": user.used_minutes >= user.max_minutes,
            },
            # 3. AI Actions (Credits) - "Pay-per-Request"
            # Used for Chat/Search features
            "ai_credits": {
                "used_actions": user.used_ai_actions,
                "limit_actions": user.max_ai_actions,
                "remaining": user.max_ai_actions - user.used_ai_actions,
                "is_empty": user.used_ai_actions >= user.max_ai_actions,
            },
        }
    
@router.get("/users/me")
async def get_user(user: User = Depends(get_current_user)):
    return user

