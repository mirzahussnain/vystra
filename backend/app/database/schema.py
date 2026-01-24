from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional, Any
from .models import VideoStatus
from .enums import NotificationType, PlanType



class PresignedUrlRequest(BaseModel):
    filename: str
    content_type: str  # e.g. "video/mp4"
    file_size: int     # Bytes

class PresignedUrlResponse(BaseModel):
    upload_url: str    # The magic S3 link
    video_id: str      # The DB ID
    s3_key: str        # Where it will live
    
    
class SegmentResponse(BaseModel):
    start: float
    end: float
    text: str


class VideoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    transcript: Optional[str] = None
    duration:Optional[float] = None
    file_size:float
    processing_error:Optional[str]
    s3_key: str
    created_at: datetime
    updated_at: datetime
    status: VideoStatus
    segments: Optional[List[SegmentResponse]] = None
    ai_title: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[List[str]] = None
    key_takeaways: Optional[List[str]] = None
    class Config:
        from_attributes = True 
        use_enum_values = True
        
class UploadVideoResponse(BaseModel):
    video_data: VideoResponse
    task_id: str
    message: str
    class Config:
        from_attributes = True 
        use_enum_values = True
        
class NotificationResponse(BaseModel):
    id: int
    video_id:Optional[ str]
    user_id: str
    message: Optional[str] = None
    is_read: bool = False
    type: NotificationType = NotificationType.INFO
    created_at: datetime
    
    
   
    
    class Config:
        from_attributes = True 
        use_enum_values = True
   
class VectorSegmentResponse(BaseModel):
    id: int
    video_id: str
    content: str
    start_time: float
    end_time: float
    #embedding: List[float]
    class Config:
        from_attributes = True 
        use_enum_values = True

class UserResponse(BaseModel):
    id: str
    email:Optional[ str]
    plan: PlanType
    
    # Usage Stats (Critical for UI progress bars)
    max_minutes: int
    used_minutes: float
    max_ai_actions: int
    used_ai_actions: int
    max_storage_bytes:int
    used_storage_bytes:int
    next_billing_date: Optional[datetime] = None
    
    stripe_subscription_id: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    
    class Config:
        from_attributes = True 
        use_enum_values=True

# Used when we Create/Sync a user from Clerk Webhook
class UserCreate(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class CheckoutRequest(BaseModel):
    plan: str