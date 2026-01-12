
import os
import whisper
from app.core.config import settings
from app.services import video as video_service
from app.database import database as db
from celery import Celery


_redis_url = settings._redis_url


celery_app = Celery("insightstream_worker", broker=_redis_url, backend=_redis_url)


# Load the AI Model (Global Variable)
# Load this ONCE when the worker starts, not every task.
print("🧠 Loading Whisper Model (Base)... this might take a minute...")
model = whisper.load_model("base")
print("✅ Whisper Model Loaded!")


@celery_app.task(name="process_video")

def process_video_task(video_id: str):
    """
    This function runs in the Background Worker.
    It receives the 'video_id' from the API.
    """
    print(f"🎬 STARTED: Processing video {video_id}...")
    
    # Define temporary file paths
    video_path = f"/tmp/{video_id}"
    audio_path = f"/tmp/{video_id}.mp3"
    
    try:
        # 1. Download the video from S3
        video_service.download_video(video_id, video_path)
        
        # 2. Extract Audio
        video_service.extract_audio(video_path, audio_path)
        
        # 3. Transcribe (The AI Magic)
        print("🤖 Transcribing audio with Whisper...")
        result = model.transcribe(audio_path)
        transcript_text =str( result["text"])
        
        print(f"📝 TRANSCRIPT PREVIEW: {transcript_text[:100]}...") # Print first 100 chars
                
        # --- SAVE TO DB ---
        print("💾 Saving to Database...")
        db.update_video_transcript(video_id, transcript_text)
        
        return {
                    "status": "completed",
                    "video_id": video_id,
                    "transcript_preview": transcript_text[:50]
                        }
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        # 4. Cleanup (Crucial!)
        # Delete temp files so Docker container doesn't fill up
        if os.path.exists(video_path): os.remove(video_path)
        if os.path.exists(audio_path): os.remove(audio_path)
        print("🧹 Cleanup complete.")

   
