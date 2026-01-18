from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic.types import SecretType
from app.database.config import Base, create_extension, engine
from app.routes.videos import router as video_router
from app.routes.search import router as search_router
from app.routes.notifications import router as notification_router
from app.services.storage import init_bucket
from app.core.config import settings

# Lifecycle Event: Run this when the app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application starting...")
    init_bucket()  # <--- Create the bucket automatically
    create_extension()
    print("Creating Database Tables")
    Base.metadata.create_all(bind=engine)
    print("✅ Database Tables Ready!")
    yield
    print("🛑 Application shutting down...")


app = FastAPI(title="InsightStream API", lifespan=lifespan)

print(settings.ALLOWED_ORIGINS)

origins=[origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins is not None else [""],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_headers=["*"]
)

# Register the router
app.include_router(video_router, prefix="/api/v1")
app.include_router(notification_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"status": "online", "storage": "minio", "db": "postgres"}
