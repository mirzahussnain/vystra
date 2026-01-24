import boto3
from botocore.client import Config

# 1. Connect to MinIO (Internal Docker URL)
s3 = boto3.client(
    "s3",
    endpoint_url="http://minio:9000",
    aws_access_key_id="minioadmin",
    aws_secret_access_key="minioadmin",
    config=Config(signature_version="s3v4", s3={"addressing_style": "path"})
)

# 2. THE FIX: Define the filter function
def fix_headers(request, **kwargs):
    # Print headers to verify we are catching the right request
    print(f"🔍 Checking headers for: {kwargs.get('operation_name')}")
    if 'x-amz-sdk-checksum-algorithm' in request.headers:
        print("   ⚠️ Found bad checksum header. Removing it...")
        del request.headers['x-amz-sdk-checksum-algorithm']

# 3. Register the filter
# We attach it to the specific CORS operation
s3.meta.events.register('before-sign.s3.PutBucketCors', fix_headers)

# 4. Define CORS Rules
cors_rule = {
    'CORSRules': [{
        'AllowedHeaders': ['*'],
        'AllowedMethods': ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
        'AllowedOrigins': ['*'],
        'ExposeHeaders': ['ETag']
    }]
}

# 5. Apply
try:
    print("⏳ Applying CORS rules...")
    s3.put_bucket_cors(Bucket="videos", CORSConfiguration=cors_rule)
    print("✅ SUCCESS! CORS rules applied.")
except Exception as e:
    print(f"❌ ERROR: {e}")