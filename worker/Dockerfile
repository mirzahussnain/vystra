# 1. Grab the static ffmpeg binary (Senior Dev Trick)
# This image contains a single 80MB binary with zero external dependencies.
FROM mwader/static-ffmpeg:6.0 AS ffmpeg

# 2. Build your actual image
FROM python:3.11-slim-bookworm

WORKDIR /app

# 3. Copy the FFmpeg binary directly
# No more 'apt-get install ffmpeg' (Saves ~600MB!)
COPY --from=ffmpeg /ffmpeg /usr/local/bin/
COPY --from=ffmpeg /ffprobe /usr/local/bin/

# 4. Install Python Dependencies
# We keep --no-cache-dir to save another ~200MB
COPY worker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy Code
COPY backend/app /app/backend/app
COPY worker/app /app/worker/app

ENV PYTHONPATH=/app

CMD ["celery", "-A", "worker.app.main.celery_app", "worker", "--pool=solo", "--concurrency=1", "--loglevel=info", "--beat"]