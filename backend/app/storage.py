import boto3
from botocore.exceptions import NoCredentialsError
import os

# Get configs from Environment Variables (set in docker-compose)
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_ENDPOINT = os.getenv("AWS_ENDPOINT_URL")
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME", "videos")

def get_s3_client():
    """Create a connection to MinIO/S3"""
    return boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        endpoint_url=AWS_ENDPOINT
    )

def init_bucket():
    """Create the 'videos' bucket if it doesn't exist"""
    s3 = get_s3_client()
    try:
        s3.create_bucket(Bucket=BUCKET_NAME)
        print(f"✅ Bucket '{BUCKET_NAME}' created or exists.")
    except Exception as e:
        print(f"❌ Error creating bucket: {e}")