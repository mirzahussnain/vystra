import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from ..database.config import settings

# Config
security = HTTPBearer()
JWKS_URL = f"{settings.CLERK_ISSUER}/.well-known/jwks.json"

# Cache the keys so we don't fetch from Clerk on every request, PyJWKClient handles caching internally
jwk_client = PyJWKClient(JWKS_URL)


async def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    token = credentials.credentials
    try:
        # 1. Get the Signing Key
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        if not kid:
            raise HTTPException(status_code=401, detail="Token header missing Key ID")

        # 2. Fetch the specific signing key using the ID
        signing_key = jwk_client.get_signing_key(kid)

        # 2. Decode & Verify
        payload = jwt.decode(
            token,
            signing_key.key,  # The actual key object
            algorithms=["RS256"],
            leeway=30,
            audience=None,  # Clerk tokens don't enforce audience by default
            issuer=settings.CLERK_ISSUER,
        )
        # 3. Return the User ID (This is the 'sub' field)
        return payload["sub"]

    except jwt.ExpiredSignatureError:
        print("❌ Error: Token has EXPIRED")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print("❌ Error: Invalid ISSUER (Check CLERK_PEM_PUBLIC_KEY or URL)")
        print(f"JWT Verification Failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")
    except Exception as e:
        print(f"Auth System Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
