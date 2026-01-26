from sqlalchemy.orm import Session
from sqlalchemy import update
from backend.app.database.config import SessionLocal
from backend.app.database.enums import NotificationType, VideoStatus
from backend.app.database.models import Notification, User, Video, VideoSegment


class Repository:
    @staticmethod
    def get_usage_limits(user_id: str):
        with SessionLocal() as db:
            user = db.get(User, user_id)
            if not user:
                return None
            return {
                "remaining_minutes": user.max_minutes - user.used_minutes,
                "remaining_credits": user.max_ai_actions - user.used_ai_actions,
                "has_minutes": user.used_minutes < user.max_minutes,
                "has_credits": user.used_ai_actions < user.max_ai_actions,
            }

    @staticmethod
    def get_meta_data(video_id: str):
        """Phase 1: Read IDs (Fast)"""
        with SessionLocal() as db:
            video = db.get(Video, video_id)
            if not video:
                return None
            return {
                "id": video_id,
                "user_id": video.user_id,
                "title": video.title,
                "s3_key": video.s3_key,
            }

    @staticmethod
    def update_quota(
        user_id: str, minutes_to_add: float = 0.0, credits_to_deduct: int = 0
    ):
        """Phase 2: Atomic Quota Update"""
        with SessionLocal() as db:
            try:
                        # We use an UPDATE statement with a F() expression style logic
                        # This happens entirely inside the SQL engine
                        stmt = (
                            update(User)
                            .where(User.id == user_id)
                            .values(
                                used_minutes=User.used_minutes + minutes_to_add,
                                used_ai_actions=User.used_ai_actions + credits_to_deduct
                            )
                        )
                        
                        result = db.execute(stmt)
                        db.commit()
                        
                        if result.rowcount == 0:
                            print(f"❌ User {user_id} not found for billing.")
                        else:
                            print(f"💰 Atomically Updated Quota for User {user_id}")
                            
            except Exception as e:
                db.rollback()
                print(f"❌ Database error during quota update: {e}")

    @staticmethod
    def mark_failed(video_id: str, error_msg: str):
        with SessionLocal() as db:
            video = db.get(Video, video_id)

            if video:
                video.status = VideoStatus.FAILED
                video.processing_error = error_msg

                # Notify User
                print(f"🔔 Queueing Failure Notification for {video_id}")
                db.add(
                    Notification(
                        video_id=video_id,
                        user_id=video.user_id,
                        message=f"Could not process '{video.title}': {error_msg}",
                        type=NotificationType.ERROR.value,
                    )
                )
                db.commit()

    @staticmethod
    def save_results(
        video_id: str,
        transcript: str,
        duration: float,
        segments: list,
        vector_segments: list,
        ai_data: dict,
    ):
        """Phase 3: Write Results"""
        with SessionLocal() as db:
            video = db.get(Video, video_id)
            if not video:
                return

            # Update Metadata
            video.transcript = transcript
            video.duration = duration
            video.status = VideoStatus.COMPLETED

            if segments:
                video.segments = segments

            if ai_data:
                video.summary = ai_data.get("summary")
                video.ai_title = ai_data.get("title")
                video.action_items = ai_data.get("action_items")
                video.key_takeaways = ai_data.get("key_takeaways")

            # Save Vector Segments
            if vector_segments:
                db_segments = [
                    VideoSegment(
                        video_id=video_id,
                        content=s["text"],  # Matches logic in tasks.py
                        start_time=s["start"],
                        end_time=s["end"],
                        embedding=s["embedding"],
                    )
                    for s in vector_segments
                ]
                db.add_all(db_segments)

            print(f"🔔 Queueing Success Notification for {video_id}")
            db.add(
                Notification(
                    video_id=video_id,
                    user_id=video.user_id,
                    message=f"Ready: '{video.title}' has been analyzed.",
                    type=NotificationType.SUCCESS,
                )
            )

            db.commit()
            print(f"💾 Results Processed & Saved for {video_id}")


# def update_user_quota(video_id: str, duration: float):
#     db: Session = SessionLocal()
#     try:
#         user = db.query(User).filter(User.id == video_id).first()
#         if not user:
#             raise ValueError(f"User {video_id} not found")
#         user.quota -= duration
#         db.commit()
#     except Exception as e:
#         db.rollback()
#     finally:
#         db.close()


# def get_video(id: str):
#     db: Session = SessionLocal()
#     try:
#         video = db.get(Video, id)
#         if not video:
#             raise ValueError(f"Video {id} not found")
#         return video
#     finally:
#         db.close()


# def update_video_transcript(
#     video_id: str, status: str, transcript=None, segments=None, ai_data=None
# ):
#     db: Session = SessionLocal()
#     try:
#         # Find the video
#         video = db.get(Video, video_id)
#         if not video:
#             raise ValueError(f"Video {video_id} not found")
#         video.status = status
#         if transcript:
#             video.transcript = transcript
#         if segments:
#             video.segments = segments
#         if ai_data:
#             # Map API keys to DB columns
#             fields = {
#                 "title": "ai_title",
#                 "summary": "summary",
#                 "action_items": "action_items",
#                 "key_takeaways": "key_takeaways",
#             }
#             for api_key, db_col in fields.items():
#                 if val := ai_data.get(api_key):  # Walrus operator: assign and check
#                     setattr(video, db_col, val)
#             if status == "completed":
#                 print(f"🔔 Queueing Success Notification for {video_id}")
#                 db.add(
#                     Notification(
#                         video_id=video_id,
#                         message=f"Completed: '{video.title}' has been analyzed.",
#                         type=NotificationType.SUCCESS,
#                         is_read=False,
#                     )
#                 )

#             elif status == "failed":
#                 print(f"🔔 Queueing Failure Notification for {video_id}")
#                 db.add(
#                     Notification(
#                         video_id=video_id,
#                         message=f"Failed: Could not process '{video.title}'.",
#                         type=NotificationType.ERROR,
#                         is_read=False,
#                     )
#                 )
#         db.commit()
#         print(f"💾 SAVED: Video {video_id} updated to '{status}'")

#     except Exception as e:
#         print(f"❌ DB Error: {e}")
#         db.rollback()
#     finally:
#         db.close()


def update_video_metaData(video_id: str, metaData: dict):
    db = SessionLocal()
    try:
        video = db.query(Video).filter(Video.id == video_id).first()
        if video:
            protected_fields = ["id", "user_id"]
            for key, value in metaData.items():
                # Only update if value is not None (and video has that attribute)
                if value is not None and key not in protected_fields and hasattr(video, key):
                    setattr(video, key, value)

            db.commit()
            print(
                f"💾 SAVED: Updated fields {list(metaData.keys())} for Video {video_id}"
            )
        else:
            print(f"❌ Video {video_id} not found.")
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
