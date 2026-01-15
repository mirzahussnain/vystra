import ffmpeg

def extract_audio(video_path: str, audio_path: str):
    """Uses FFmpeg to extract audio from video"""
    try:
        # Equivalent command: ffmpeg -i video.mp4 -vn -acodec libmp3lame audio.mp3
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, acodec='libmp3lame', loglevel='quiet')
            .run(overwrite_output=True)
        )
        print(f"🎵 Extracted audio to {audio_path}")
    except ffmpeg.Error as e:
        print(f"❌ FFmpeg Error: {e.stderr}")
        raise e