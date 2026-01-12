import boto3
from botocore.exceptions import NoCredentialsError
from app.core.config import settings

AWS_ACCESS_KEY = settings._aws_access_key_id
AWS_SECRET_KEY = settings._aws_secret_access_key
AWS_ENDPOINT = settings._aws_endpoint_url
BUCKET_NAME = settings._aws_bucket_name

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