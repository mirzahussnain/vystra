import enum

from app.core.config import settings
from sqlalchemy import JSON, Column, DateTime, Enum, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func


if settings._database_url is not None:
    engine = create_engine(settings._database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
else:
    raise ValueError("DATABASE_URL is not set")

class VideoStatus(str, enum.Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    
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
    

# 3. Update the DB
def update_video_transcript(video_id: str, status: str, transcript: str = None,segments:list=None):
    session = SessionLocal()
    try:
        # Find the video
        video = session.query(Video).filter(Video.id == video_id).first()
        if video:
            video.status = status
            if transcript:
                video.transcript = transcript
            if segments:
                video.analysis = segments
            session.commit()
            print(f"💾 SAVED: Transcript & Analysis for {video_id} saved to DB!")
        else:
            print(f"⚠️ Warning: Video {video_id} not found in DB.")
    except Exception as e:
        print(f"❌ DB Error: {e}")
        session.rollback()
    finally:
        session.close()
