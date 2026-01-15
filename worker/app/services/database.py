from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.database.models import Video


def update_video_transcript(video_id: str, status: str, transcript: str = None,segments:list=None):
    db:Session=Depends(get_db)
    try:
        # Find the video
        video = db.query(Video).filter(Video.id == video_id).first()
        if video:
            video.status = status
            if transcript:
                video.transcript = transcript
            if segments:
                video.analysis = segments
            db.commit()
            print(f"💾 SAVED: Transcript & Analysis for {video_id} saved to DB!")
        else:
            print(f"⚠️ Warning: Video {video_id} not found in DB.")
    except Exception as e:
        print(f"❌ DB Error: {e}")
        db.rollback()
    finally:
        db.close()