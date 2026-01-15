from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Any
from app.database.enums import VideoStatus

class VideoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    transcript: Optional[str] = None
    s3_key: str
    created_at: datetime
    status: VideoStatus
    analysis: Optional[List[Any]] = None
    class Config:
        from_attributes = True 
        use_enum_values = True