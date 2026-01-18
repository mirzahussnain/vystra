
from sqlalchemy import JSON, Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.config import Base
from app.database.enums import NotificationType, VideoStatus
from pgvector.sqlalchemy import Vector

class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    transcript = Column(String, nullable=True)
    s3_key = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(
        Enum(VideoStatus,native_enum=False, length=50),
        default=VideoStatus.PROCESSING,
        nullable=False,
    )
    segments = Column(JSON, nullable=True) 
    ai_title = Column(String, nullable=True)
    summary = Column(Text,nullable=True)               
    action_items = Column(JSON, nullable=True)          # List of tasks ["Task 1", "Task 2"]
    key_takeaways = Column(JSON, nullable=True)         # List of bullet points
    vector_segments = relationship("VideoSegment", back_populates="video", cascade="all, delete")

class VideoSegment(Base):
    __tablename__ = "video_segments"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"))
    
    content = Column(Text)       # The actual text (e.g., "Hello world")
    start_time = Column(Float)   # e.g., 12.5 seconds
    end_time = Column(Float)     # e.g., 15.0 seconds
    
    # 384 dimensions matches the 'all-MiniLM-L6-v2' model we used in the worker
    embedding = Column(Vector(384)) 
    video = relationship("Video", back_populates="vector_segments")
    
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"))
    message = Column(String)
    is_read = Column(Boolean, default=False)
    
    # NEW: Type of notification
    type = Column(Enum(NotificationType), default=NotificationType.INFO) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())