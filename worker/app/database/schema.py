from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Any
from app.database.enums import NotificationType, VideoStatus

class VideoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    transcript: Optional[str] = None
    s3_key: str
    created_at: datetime
    status: VideoStatus
    segments: Optional[List[Any]] = None
    ai_title: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[List[Any]] = None
    key_takeaways: Optional[List[Any]] = None
    class Config:
        from_attributes = True 
        use_enum_values = True

class NotificationResponse(BaseModel):
    id: str
    type: NotificationType
    message: str
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
    embedding: List[float]
    class Config:
        from_attributes = True 
        use_enum_values = True