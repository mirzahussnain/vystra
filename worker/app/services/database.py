from sqlalchemy.orm import Session
from app.database.config import SessionLocal
from app.database.models import Notification, Video, VideoSegment
from app.database.enums import NotificationType


def update_video_transcript(video_id: str, status: str, transcript= None,segments=None,ai_data=None):
    db:Session=SessionLocal()
    try:
        # Find the video
        video = db.get(Video, video_id)
        if not video:
                    
                    raise ValueError(f"Video {video_id} not found")
        video.status = status
        if transcript:
            video.transcript = transcript
        if segments:
            video.segments = segments
        if ai_data:
                # Map API keys to DB columns
                fields = {
                    'title': 'ai_title',
                    'summary': 'summary',
                    'action_items': 'action_items',
                    'key_takeaways': 'key_takeaways'
                }
                for api_key, db_col in fields.items():
                    if val := ai_data.get(api_key): # Walrus operator: assign and check
                        setattr(video, db_col, val)
                if status == "completed":
                    print(f"🔔 Queueing Success Notification for {video_id}")
                    db.add(Notification(
                        video_id=video_id,
                        message=f"Completed: '{video.title}' has been analyzed.",
                        type=NotificationType.SUCCESS,
                        is_read=False
                    ))
                    
                elif status == "failed":
                    print(f"🔔 Queueing Failure Notification for {video_id}")
                    db.add(Notification(
                    video_id=video_id,
                    message=f"Failed: Could not process '{video.title}'.",
                    type=NotificationType.ERROR,
                    is_read=False
                    ))
        db.commit()
        print(f"💾 SAVED: Video {video_id} updated to '{status}'")
        
       
    except Exception as e:
        print(f"❌ DB Error: {e}")
        db.rollback()
    finally:
        db.close()
        

def save_segment_vectors(segments_data: list):
    """
    Bulk saves video segments with their vector embeddings.
    """
    db = SessionLocal()
    try:
        # 1. Convert Dictionary list to Model Objects
        new_rows = [VideoSegment(**data) for data in segments_data]

        # 2. Bulk Insert (Much faster than looping)
        db.add_all(new_rows)
        db.commit()
        print(f"✅ Indexed {len(new_rows)} segments for Search.")
        return True
    except Exception as e:
        print(f"❌ Failed to save vectors: {e}")
        db.rollback()
        return False
    finally:
        db.close()