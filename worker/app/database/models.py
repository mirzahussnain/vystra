
from sqlalchemy import JSON, Column, DateTime, Enum, String
from sqlalchemy.sql import func
from app.database.config import Base
from app.database.enums import VideoStatus


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
    analysis = Column(JSON, nullable=True)
    