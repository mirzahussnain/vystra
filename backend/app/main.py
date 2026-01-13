from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.models import models
from app.routes.routers import router as video_router
from app.services.storage import init_bucket
from app.core.config import settings

# Lifecycle Event: Run this when the app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application starting...")
    init_bucket()  # <--- Create the bucket automatically

    print("Creating Database Tables")
    Base.metadata.create_all(bind=engine)
    print("✅ Database Tables Ready!")
    yield
    print("🛑 Application shutting down...")


app = FastAPI(title="InsightStream API", lifespan=lifespan)

origins=settings._allowed_origins
if origins is not None:
    origins=[origin.strip() for origin in origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins is not None else [""],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"]
)

# Register the router
app.include_router(video_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"status": "online", "storage": "minio", "db": "postgres"}
