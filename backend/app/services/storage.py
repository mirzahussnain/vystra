import boto3
from botocore.exceptions import NoCredentialsError
from app.core.config import settings


def get_s3_client():
    """Create a connection to MinIO/S3"""
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        endpoint_url=settings.AWS_ENDPOINT_URL
    )

def init_bucket():
    """Create the 'videos' bucket if it doesn't exist"""
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=settings.AWS_BUCKET_NAME)
        print(f"✅ Bucket '{settings.AWS_BUCKET_NAME}' created or exists.")
    except Exception as e:
        print(f"❌ Error creating bucket: {e}")