import boto3
import ffmpeg
from app.core.config import settings


_aws_access_key_id = settings._aws_access_key_id
_aws_secret_access_key = settings._aws_secret_access_key
_aws_endpoint_url = settings._aws_endpoint_url
_bucket_name = settings._bucket_name


def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=_aws_access_key_id,
        aws_secret_access_key=_aws_secret_access_key,
        endpoint_url=_aws_endpoint_url
    )

def download_video(video_id: str, local_path: str):
    """Downloads video from MinIO to local disk"""
    s3 = get_s3_client()
    try:
        s3.download_file(_bucket_name, video_id, local_path)
        print(f"📥 Downloaded {video_id} to {local_path}")
    except Exception as e:
        print(f"❌ Error downloading: {e}")
        raise e

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