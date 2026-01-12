import os


class Settings:
    PROJECT_NAME: str = "InsightStream-Worker"
    PROJECT_VERSION: str = "1.0.0"

    _redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
    _database_url=os.getenv("DATABASE_URL")
    _aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID", "minioadmin")
    _aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY", "minioadmin")
    _aws_endpoint_url = os.getenv("AWS_ENDPOINT_URL", "http://minio:9000")
    _bucket_name = os.getenv("AWS_BUCKET_NAME", "videos")

    if _redis_url is None:
        raise ValueError("REDIS_URL is not set in .env file")
    if _aws_access_key_id is None:
        raise ValueError("AWS_ACCESS_KEY_ID is not set in .env file")
    if _aws_secret_access_key is None:
        raise ValueError("AWS_SECRET_ACCESS_KEY is not set in .env file")
    if _aws_endpoint_url is None:
        raise ValueError("AWS_ENDPOINT_URL is not set in .env file")
    if _bucket_name is None:
        raise ValueError("AWS_BUCKET_NAME is not set in .env file")

    # Redis
    REDIS_URL: str = _redis_url

    # AWS
    AWS_ACCESS_KEY_ID: str = _aws_access_key_id
    AWS_SECRET_ACCESS_KEY: str = _aws_secret_access_key
    AWS_ENDPOINT_URL: str = _aws_endpoint_url
    AWS_BUCKET_NAME: str = _bucket_name


settings = Settings()
