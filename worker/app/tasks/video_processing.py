import os

from ..helpers.video_processing import (
    generate_ai_insights,
    generate_transcription,
    generate_vector_embeddings,
)
from ..services import ffmpeg, storage
from ..services.celery_client import celery_app
from ..services.database import Repository


@celery_app.task(name="process_video", bind=True, max_retries=3)
def process_video_task(self, video_id: str):
    print(f"🎬 STARTED: Processing video {video_id}...")

    video_path = ""
    audio_path = ""

    # 1. GET METADATA
    meta = Repository.get_meta_data(video_id)
    if not meta:
        print(f"❌ Video {video_id} not found. Aborting.")
        return

    try:
        limits = Repository.get_usage_limits(meta["user_id"])

        # Guard 1: Check limits BEFORE downloading the file.
        if not limits or not limits["has_minutes"]:
            print(f"⛔ Quota Exceeded for User {meta['user_id']}. Aborting.")
            Repository.mark_failed(
                video_id, "Quota Exceeded: Please upgrade your plan."
            )
            return

        video_id = meta["id"]
        video_key = meta["s3_key"]
        video_path = f"/tmp/{video_id}.mp4"
        audio_path = f"/tmp/{video_id}.mp3"

        # 2. DOWNLOAD
        storage.download_video(video_key, video_path)
        # 3. Extracting Audio
        ffmpeg.extract_audio(video_path, audio_path)

        # 3. DURATION & BILLING
        # ffmpeg.probe works on video files too)

        duration = ffmpeg.calculate_duration(video_path)
        duration_min = duration.get("duration_minutes", 0)
        duration_sec = duration.get("duration_seconds", 0)

        # Guard 2:Check if duration exceeds remaining minutes
        if duration_min > (limits["remaining_minutes"] + 2.0):
            Repository.mark_failed(
                video_id,
                f"Video too long ({duration_min:.1f} min). Your remaining minutes: {limits['remaining_minutes']:.1f} min. Upgrade your plan to continue.",
            )
            return

        # 4. TRANSCRIBE
        print("🤖 Transcribing...")
        # ( returns full_text and segments)
        result = generate_transcription(audio_path)

        # GUARD 2: Technical Failure
        if not result:
            raise RuntimeError("Transcription Service Failed (Returned None).")

        transcript_text = result.get("full_text", "").strip()
        segments = result.get("segments", [])

        # Initialize empty variables for the dependent steps
        vector_segments = []
        ai_data = None
        credits_to_charge = 0

        # GUARD 3:
        if not transcript_text:
            # We do NOT fail the task. We mark it complete but empty.
            # This is valid (user uploaded a silent video).
            print("⚠️ Video appears to be silent. Skipping AI & Search.")

        else:
            # 5. Embeddings
            print(f"🧠 Generating Vectors for {len(segments)} segments...")
            vector_segments = generate_vector_embeddings(segments)

            # 6. AI Insights (Only if text is substantial)
            # Only run expensive Llama 3 calls if user has credits
            if limits["has_credits"] and len(transcript_text) > 100:
                print("🧠 Generating AI Insights...")
                ai_data = generate_ai_insights(transcript_text)

                if ai_data:
                    credits_to_charge = 1

            else:
                print("⛔ No AI Credits or text too short. Skipping Summary.")
                ai_data = {
                    "summary": "AI summary not available (Insufficient credits or silent video).",
                    "key_takeaways": [],
                    "action_items": [],
                }
        # 7. SAVE RESULTS
        print("💾 Saving Results...")
        Repository.save_results(
            video_id=video_id,
            transcript=transcript_text,
            duration=duration_sec,
            segments=segments,
            vector_segments=vector_segments,
            ai_data=ai_data,
        )

        Repository.update_quota(
            meta["user_id"],
            minutes_to_add=duration_min,
            credits_to_deduct=credits_to_charge,
        )

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        Repository.mark_failed(video_id, str(e))

    finally:
        # 9. CLEANUP
        # Using ignore_errors=True to prevent crashes during cleanup
        for p in [video_path, audio_path]:
            if p and os.path.exists(p):
                try:
                    os.remove(p)
                except:
                    pass
        print("🧹 Cleanup complete.")
