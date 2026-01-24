import os


class SETTINGS:
    PROJECT_NAME: str = "InsightStream-Backend"
    VERSION: str = "1.0.0"

    _allowed_origins=os.getenv("ALLOWED_ORIGINS")
    _admin_secret_key=os.getenv("ADMIN_SECRET_KEY")
    _stripe_api_key=os.getenv("STRIPE_API_KEY")
    _stripe_webhook_key=os.getenv("STRIPE_WEBHOOK_KEY")
    _pro_price_id=os.getenv("STRIPE_PRO_PRICE_ID")
    _ent_price_id=os.getenv("STRIPE_ENT_PRICE_ID")
    _clerk_issuer=os.getenv("CLERK_ISSUER")
    _database_url = str(os.getenv("DATABASE_URL"))
    _redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
    _aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID", "minioadmin")
    _aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY", "minioadmin")
    _aws_endpoint_url = os.getenv("AWS_ENDPOINT_URL", "http://minio:9000")
    _aws_bucket_name = os.getenv("AWS_BUCKET_NAME", "videos")
    _environment = os.getenv("ENVIRONMENT")
    _frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    _clerk_webhook_secret=os.getenv("CLERK_WEBHOOK_SECRET")
    if _database_url is None:
        raise ValueError("DATABASE_URL environment variable is not set")
        
    if _admin_secret_key is None:
        raise ValueError("ADMIN_SECRET_KEY environment variable is not set")
    if _stripe_webhook_key is None:
        raise ValueError("STRIPE_WEBHOOK_KEY environment variable is not set")
    
    if _clerk_issuer is None:
        raise ValueError("CLERK_ISSUER environment variable is not set")
        
    if _clerk_webhook_secret is None:
        raise ValueError("CLERK_WEBHOOK_SECRET environment variable is not set")
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

    if _allowed_origins is None:
        raise ValueError("ALLOWED_ORIGINS environment variable is not set")
        
    if _environment is None:
        raise ValueError("ENVIRONMENT environment variable is not set")
    
    if _pro_price_id is None:
        raise ValueError("PRO_PRICE_ID environment variable is not set")
        
    if _ent_price_id is None:
        raise ValueError("ENT_PRICE_ID environment variable is not set")
        
    if _stripe_api_key is None:
        raise ValueError("STRIPE_API_KEY environment variable is not set")
        
    
    PLAN_LIMITS = {
        "free": {
            "max_minutes": 15,
            "max_ai_actions": 3,
            "max_storage_bytes": 250 * 1024 * 1024, # 250 MB
        },
        "pro": {
            "max_minutes": 600,            # 10 Hours
            "max_ai_actions": 500,
            "max_storage_bytes": 50 * 1024 * 1024 * 1024, # 50 GB
        },
        "enterprise": {
            "max_minutes": 6000,           # 100 Hours
            "max_ai_actions": 999999,      # Effectively Unlimited
            "max_storage_bytes": 1024 * 1024 * 1024 * 1024, # 1 TB
        }
    }
    AWS_ACCESS_KEY_ID = _aws_access_key_id
    AWS_SECRET_ACCESS_KEY = _aws_secret_access_key
    AWS_ENDPOINT_URL = _aws_endpoint_url
    AWS_BUCKET_NAME = _aws_bucket_name
    ENVIRONMENT = _environment
    ALLOWED_ORIGINS = _allowed_origins
    CLERK_ISSUER = _clerk_issuer
    DATABASE_URL = _database_url
    ADMIN_SECRET_KEY = _admin_secret_key
    REDIS_URL = _redis_url
    STRIPE_API_KEY = _stripe_api_key
    STRIPE_PRICES={
        "pro":_pro_price_id,
        "enterprise":_ent_price_id
    }
    STRIPE_WEBHOOK_KEY = _stripe_webhook_key
    FRONTEND_URL = _frontend_url
    CLERK_WEBHOOK_SECRET=_clerk_webhook_secret

settings = SETTINGS()
