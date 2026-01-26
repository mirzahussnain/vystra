import boto3
from botocore.exceptions import ClientError
from ..core.config import settings


def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        endpoint_url=settings.AWS_ENDPOINT_URL
    )
    
    
def download_video(video_id: str, local_path: str):
    """Downloads video from MinIO/BackBlaze B2 to local disk"""
    s3 = get_s3_client()
    try:
        s3.download_file(settings.AWS_BUCKET_NAME, video_id, local_path)
        print(f"📥 Downloaded {video_id} to {local_path}")
    except Exception as e:
        print(f"❌ Error downloading: {e}")
        raise e
        
def delete_video(s3_key:str):
    """
    Deletes a file from S3 bucket.
    """
    s3=get_s3_client()

    try:
        s3.delete_object(Bucket=settings.AWS_BUCKET_NAME, Key=s3_key)
        print(f"🗑️ Successfully deleted {s3_key} from S3.")
    except ClientError as e:
        print(f"❌ Failed to delete from S3: {e}")