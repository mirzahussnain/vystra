import boto3
from botocore.client import Config
from botocore.exceptions import NoCredentialsError
from ..core.config import settings


# def get_s3_client(bucket_create=False):
#     """Create a connection to MinIO/S3"""
#     is_dev = settings.ENVIRONMENT == "development"
#     if not bucket_create:
#         signing_url = "http://127.0.0.1:9000" if is_dev else settings.AWS_ENDPOINT_URL
#     else:
#         signing_url =  settings.AWS_ENDPOINT_URL
#     return boto3.client(
#         's3',
#         aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#         aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
#         endpoint_url=signing_url,
#         config=Config(signature_version='s3v4'),
#         region_name='auto'
        
#     )
def get_s3_client(for_browser=False):
    """
    for_browser=True: Use 127.0.0.1 (For generating Presigned URLs)
    for_browser=False: Use 'minio' (For internal Backend/Worker tasks like HeadObject)
    """
    is_dev = settings.ENVIRONMENT == "development"
    
    
    # If it's for the browser and we are in dev, use 127.0.0.1.
    # Otherwise, use the internal endpoint (http://minio:9000).
    if for_browser and is_dev:
        endpoint = "http://127.0.0.1:9000"
        config=Config(
            signature_version='s3v4',
            s3={'addressing_style': 'path'}
        )
    else:
        endpoint = settings.AWS_ENDPOINT_URL
        config=Config(
            signature_version='s3v4',
        )

    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        endpoint_url=endpoint,
        # FIX 1: Path addressing is mandatory for 127.0.0.1/IP access
        config=config,
        # FIX 2: Use a standard region to prevent signature mismatches
        region_name= 'us-east-1'if is_dev else'auto'
    )
    
def init_bucket():
    """Create the 'videos' bucket if it doesn't exist"""
    s3 = get_s3_client(False)
    try:
        s3.create_bucket(Bucket=settings.AWS_BUCKET_NAME)
        print(f"✅ Bucket '{settings.AWS_BUCKET_NAME}' created or exists.")
    except Exception as e:
        print(f"❌ Error creating bucket: {e}")