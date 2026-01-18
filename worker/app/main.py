
import os
from app.services.whisper import model
from app.services.sentence_transformer import search_model
from app.core.config import settings
from app.services import ffmpeg,database,storage
from celery import Celery
from app.database.enums import NotificationType, VideoStatus
from app.services.grok import generate_summary
from app.database.models import Notification




celery_app = Celery("insightstream_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)





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
        vector_segments = []
        for s in segments:
                text = s["text"].strip()
                if len(text) < 5:
                    continue
                clean_segments.append({
                    "start": s["start"], # Seconds (e.g., 12.5)
                    "end": s["end"],
                    "text": text
                })
                # B. Vector Segment (for Search) 
                         # Convert text -> [0.1, -0.5, ...]
                vector = search_model.encode(text).tolist()
                vector_segments.append({
                                "video_id": video_id,
                                "content": text,
                                "start_time": s["start"],
                                "end_time": s["end"],
                                "embedding": vector
                            })
       
        # C. Groq Analysis
        print("🧠 Sent to Groq for Analysis...")
        ai_data = generate_summary(transcript_text)
        if ai_data:
            print("✅ Groq Analysis Complete")
        else:
            print("❌ Groq Analysis Failed")
        
       
        # --- SAVE TO DB ---
        print("💾 Saving to Database...")
        database.update_video_transcript(video_id,status=VideoStatus.COMPLETED.value,transcript=transcript_text,segments=clean_segments,ai_data=ai_data)
        database.save_segment_vectors(vector_segments)
        
        
       
    except Exception as e:
        database.update_video_transcript(video_id,status=VideoStatus.FAILED.value)
        print(f"❌ CRITICAL ERROR: {e}")
        
    finally:
        # 4. Cleanup (Crucial!)
        # Delete temp files so Docker container doesn't fill up
        if os.path.exists(video_path): os.remove(video_path)
        if os.path.exists(audio_path): os.remove(audio_path)
        print("🧹 Cleanup complete.")

   
