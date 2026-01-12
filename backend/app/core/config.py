import os


class SETTINGS:
    PROJECT_NAME: str = "InsightStream-Backend"
    VERSION: str = "1.0.0"
    _database_url = os.getenv("DATABASE_URL")
    _redis_url = os.getenv("REDIS_URL","redis://redis:6379/0")
    _aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID","minioadmin")
    _aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY","minioadmin")
    _aws_endpoint_url=os.getenv("AWS_ENDPOINT_URL","http://minio:9000")
    _aws_bucket_name = os.getenv("AWS_BUCKET_NAME", "videos")
    
    if _database_url is None:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    if _redis_url is None:
        raise ValueError("REDIS_URL environment variable is not set")
    
    if _aws_access_key_id is None:
        raise ValueError("AWS_ACCESS_KEY_ID environment variable is not set")
    
    if _aws_secret_access_key is None:
        raise ValueError("AWS_SECRET_ACCESS_KEY environment variable is not set")
    
    if _aws_endpoint_url is None:
        raise ValueError("AWS_ENDPOINT_URL environment variable is not set")
    
    if _aws_bucket_name is None:
        raise ValueError("AWS_BUCKET_NAME environment variable is not set")
    
 
    
settings=SETTINGS()