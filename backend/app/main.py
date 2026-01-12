from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.database import Base, engine
from app.models import models
from app.routes.routers import router as video_router
from app.services.storage import init_bucket


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
# Register the router
app.include_router(video_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"status": "online", "storage": "minio", "db": "postgres"}
