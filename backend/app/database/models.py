from datetime import datetime, timezone, timedelta
from sqlalchemy import JSON, BigInteger, Boolean, Column, DateTime, Enum, Float, ForeignKey, Index, Integer, String, Text, func
from sqlalchemy.orm import relationship
from .config import Base
from .enums import NotificationType, PlanType, UserStatus, VideoStatus
from pgvector.sqlalchemy import Vector

class User(Base):
    __tablename__="users"
    id=Column(String,primary_key=True,index=True)
    email=Column(String,unique=True,index=True)
    first_name=Column(String,nullable=True)
    last_name=Column(String,nullable=True)
    
    # Billin
    stripe_customer_id=Column(String,unique=True,nullable=True)
    stripe_subscription_id=Column(String,unique=True,nullable=True)
    plan=Column(Enum(PlanType),default=PlanType.FREE.value)
    
    # Usage Tracking (The Metrics)
    # Storage Limits
    max_minutes = Column(Integer, default=10)       # Limit: 10 mins for free
    used_minutes = Column(Float, default=0.0)       # Usage: 4.5 mins used
    max_storage_bytes = Column(BigInteger, default=1_073_741_824) 
    used_storage_bytes = Column(BigInteger, default=0)
    # AI-Limits
    max_ai_actions=Column(Integer,default=5)
    used_ai_actions = Column(Integer, default=0)
    
    # Cycle Management
    # We need to know WHEN to reset the "used" counters back to 0
    next_billing_date = Column(DateTime, default=lambda: datetime.now(timezone.utc) + timedelta(days=30))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    videos = relationship("Video", back_populates="owner",cascade="all,delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    duration = Column(Float)     # Duration of the video
    file_size=Column(Float,default=0.0)
    processing_error=Column(String, nullable=True)
    s3_key = Column(String)  # filename in Minio
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(
        Enum(VideoStatus, native_enum=False, length=50),
        default=VideoStatus.PENDING,
        nullable=False,
    )
    segments = Column(JSON, nullable=True)  
    ai_title = Column(String, nullable=True)
    summary = Column(Text, nullable=True)               
    action_items = Column(JSON, nullable=True)          # List of tasks ["Task 1", "Task 2"]
    key_takeaways = Column(JSON, nullable=True)   # List of bullet points
    
    # Relationships
    vector_segments = relationship("VideoSegment", back_populates="video", cascade="all, delete-orphan")
    owner = relationship("User", back_populates="videos")
    
    
class VideoSegment(Base):
    __tablename__ = "video_segments"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"))
    
    content = Column(Text)       # The actual text (e.g., "Hello world")
    start_time = Column(Float)   # e.g., 12.5 seconds
    end_time = Column(Float)     # e.g., 15.0 seconds
    # 384 dimensions matches the 'all-MiniLM-L6-v2' model we used in the worker
    embedding = Column(Vector(384)) 
    
    # Vector Index
    # This tells Postgres: "Organize these vectors for fast searching"
    __table_args__ = (
             Index(
                 'idx_video_segments_embedding', 
                 embedding, 
                 postgresql_using='hnsw',
                 postgresql_with={'m': 16, 'ef_construction': 64},
                 postgresql_ops={'embedding': 'vector_l2_ops'}
             ),
         )
    
    # Relationship
    video = relationship("Video", back_populates="vector_segments")
 





class Notification(Base):
    __tablename__="notifications"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"),nullable=True)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    # NEW: Type of notification
    type = Column(Enum(NotificationType), default=NotificationType.INFO) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="notifications")
    video = relationship("Video")

