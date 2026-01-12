FROM python:3.14.2-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev ffmpeg && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["celery","-A","app.main.celery_app","worker","--loglevel=info"]
