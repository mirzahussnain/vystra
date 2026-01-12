from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.storage import init_bucket  
from app.routers import router as video_router


# Lifecycle Event: Run this when the app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application starting...")
    init_bucket()  # <--- Create the bucket automatically
    yield
    print("🛑 Application shutting down...")


app = FastAPI(title="InsightStream API", lifespan=lifespan)
# Register the router
app.include_router(video_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "online", "storage": "minio"}
