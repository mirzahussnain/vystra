
import os
import whisper
from app.core.config import settings
from app.services import ffmpeg,database,storage
from app.database.config import get_db
from celery import Celery
from app.database.enums import VideoStatus





celery_app = Celery("insightstream_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)


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
        storage.download_video(video_id, video_path)
        
        # 2. Extract Audio
        ffmpeg.extract_audio(video_path, audio_path)
        
        # 3. Transcribe (The AI Magic)
        print("🤖 Transcribing audio with Whisper...")
        result = model.transcribe(audio_path)
        
        # A. The Full Text (For general search)
        transcript_text =str( result["text"])
        
        # B. The Segments (For timestamp search)
       
        segments = result["segments"]
        clean_segments = []
        for s in segments:
                    clean_segments.append({
                        "start": s["start"], # Seconds (e.g., 12.5)
                        "end": s["end"],
                        "text": s["text"].strip()
                    })
        # --- SAVE TO DB ---
        print("💾 Saving to Database...")
        database.update_video_transcript(video_id,status=VideoStatus.COMPLETED.value,transcript=transcript_text,segments=clean_segments)
        
        return {
                    "status": "completed",
                    "video_id": video_id,
                    "transcript_preview": transcript_text[:50]
                        }
    except Exception as e:
        database.update_video_transcript(video_id,status=VideoStatus.FAILED.value)
        print(f"❌ CRITICAL ERROR: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        # 4. Cleanup (Crucial!)
        # Delete temp files so Docker container doesn't fill up
        if os.path.exists(video_path): os.remove(video_path)
        if os.path.exists(audio_path): os.remove(audio_path)
        print("🧹 Cleanup complete.")

   
