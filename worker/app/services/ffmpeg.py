import ffmpeg

def extract_audio(video_path: str, audio_path: str):
    """Uses FFmpeg to extract audio from video"""
    try:
        # Equivalent command: ffmpeg -i video.mp4 -vn -acodec libmp3lame audio.mp3
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, loglevel='quiet',ac=1, codec="libmp3lame", audio_bitrate="64k", vn=None)
            .run(overwrite_output=True)
        )
        print(f"🎵 Extracted audio to {audio_path}")
        
    except ffmpeg.Error as e:
        print(f"❌ FFmpeg Error: {e.stderr}")
        raise e
        
def calculate_duration(video_path: str):
    """Uses FFmpeg to calculate duration of video"""
    try:
        probe = ffmpeg.probe(video_path)
        duration_seconds = float(probe['format']['duration'])
        duration_minutes = duration_seconds / 60.0
        print(f"⏱️ Duration: {duration_minutes:.2f} minutes")
        return {
            'duration_minutes': duration_minutes,
            'duration_seconds': duration_seconds
        }
        
    except ffmpeg.Error as e:
        print(f"❌ FFmpeg Error: {e.stderr}")
        raise e
        