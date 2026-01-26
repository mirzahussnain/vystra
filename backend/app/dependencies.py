# src/dependencies.py
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from .database.config import get_db
from .database.enums import PlanType
from .database.models import User
from .services.auth import verify_clerk_token


# 1. Get the Full User Object from DB
def get_current_user(
    user_id: str = Depends(verify_clerk_token), db: Session = Depends(get_db)
) -> User:
    """
    Fetches the user from Postgres using the Clerk ID.
    If they don't exist in Postgres (sync error), we block them.
    """
    user = db.get(User, user_id)

    if not user:
        user = User(id=user_id, email="unknown@example.com", plan=PlanType.FREE)
        db.add(user)
        db.commit()
        db.refresh(user)
        raise HTTPException(
            status_code=401,
            detail="User not found in database. Please contact support.",
        )
    return user


# 2. The Storage Enforcer (For Uploads)
def require_storage_quota(
    user: User = Depends(get_current_user),
    content_length: int = Header(..., alias="Content-Length"),
):
    """
    Checks if the user has reached their minute limit.
    Used on: /upload-video
    """
    # 1. Check if user is ALREADY full
    if user.used_storage_bytes >= user.max_storage_bytes:
            raise HTTPException(status_code=403, detail="Storage full. Please Upgrade to Premium Plan.")
    
    # 2. Check if THIS FILE fits
    # (Current Usage + New File > Limit)
    if (user.used_storage_bytes + content_length) > user.max_storage_bytes:
        free_space_mb = (user.max_storage_bytes - user.used_storage_bytes) / (1024*1024)
        raise HTTPException(
            status_code=413, # Payload Too Large
            detail=f"Not enough space. You have {free_space_mb:.2f} MB remaining."
        )    
    # Simple check: If they are already over the limit, stop them.
    # Note: Precise checking happens AFTER upload usually, but this blocks abuse.
    if user.used_minutes >= user.max_minutes:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Storage limit reached ({user.used_minutes:.2f}/{user.max_minutes} mins). Please upgrade to Premium.",
        )
    return user


# 3. The AI Enforcer (For Summaries/Chat)
def require_ai_quota(user: User = Depends(get_current_user)):
    """
    Checks if the user has AI credits left.
    Used on: /generate-summary, /chat
    """
    if user.used_ai_actions >= user.max_ai_actions:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Monthly AI limit reached ({user.used_ai_actions}/{user.max_ai_actions}). Upgrade for More Credits.",
        )
    return user
