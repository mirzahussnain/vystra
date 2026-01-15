from sqlalchemy import JSON, Column, DateTime, Enum, String, Text, func
from app.database.config import Base
from app.database.enums import VideoStatus


class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    s3_key = Column(String)  # filename in Minio
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(
        Enum(VideoStatus, native_enum=False, length=50),
        default=VideoStatus.PROCESSING,
        nullable=False,
    )
    analysis = Column(JSON, nullable=True)  
