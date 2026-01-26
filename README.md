# Vystra 🎥 (AI Intelligence — Integrated)

[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![Groq](https://img.shields.io/badge/groq-integrated-purple.svg)](#)
[![FastEmbed](https://img.shields.io/badge/fastembed-ready-orange.svg)](#)
[![pgvector](https://img.shields.io/badge/pgvector-enabled-lightgrey.svg)](#)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](#)

> AI-Powered Video Search Engine & SaaS Platform — transcribe, index, and semantically search video content end-to-end.

InsightStream is a microservices application that converts uploaded videos into searchable knowledge. Videos are ingested, audio is extracted (FFmpeg), speech is transcribed (Groq Whisper), embeddings are generated (FastEmbed), vectors are stored and indexed with `pgvector` (HNSW), and semantic search is exposed via a `FastAPI` backend with a modern `Next.js` frontend.

---

## Table of Contents

- [Summary of Progress](#-summary-of-progress)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Feature Status](#-feature-status)
- [Installation & Setup](#-installation--setup)
  - [Prerequisites](#prerequisites)
  - [Clone](#clone)
  - [Environment (.env)](#configure-environment-env)
  - [Launch (Docker Compose)](#launch-the-system)
  - [Frontend (local dev)](#run-frontend-local-dev)
- [Project Structure (high level)](#-project-structure-high-level)
- [API Examples](#-api-examples)
- [Model & Indexing Notes](#-model--indexing-notes)
- [Contributing](#-contributing)
- [License & Security Notes](#license--security-notes)

---

## 🆕 Summary of Progress

What I updated and verified in the codebase:
- Complete AI pipeline implemented in the `worker`:
  - Static `FFmpeg` binary bundled into the worker image for robust audio extraction.
  - Transcription via Groq's Whisper (v3) through the `groq` client.
  - Embeddings generated with `fastembed.TextEmbedding(model_name="BAAI/bge-small-en-v1.5")`.
  - AI insight/summarization using Groq Llama 3 models.
- Vector storage and search:
  - `VideoSegment` embedding column uses `pgvector` (`Vector(384)`).
  - HNSW vector index configured for fast nearest-neighbor search.
- Backend and frontend:
  - `FastAPI` backend handles uploads, task management, and semantic search endpoints.
  - `Next.js` frontend (React 19) with `Clerk` for auth and Tailwind for UI.
- Orchestration:
  - `docker-compose` file includes `redis`, `db` (pgvector-enabled image), `minio`, `backend`, and `worker`.

---

## 🏗 Architecture & Tech Stack

- Backend: `FastAPI` (Python)
- Worker: `Celery` + Python worker process
- Broker: `Redis`
- Object storage: `MinIO` (S3-compatible)
- Database: `Postgres` with `pgvector` extension (HNSW index)
- Transcription & LLMs: `Groq` (Whisper v3 for audio transcription, Llama 3 for insights)
- Embeddings: `FastEmbed` (BAAI/bge-small-en-v1.5)
- Audio tooling: Static `FFmpeg` binary included in `worker/Dockerfile`
- Frontend: `Next.js` + `Clerk` + `Tailwind` + `Framer Motion`
- Dev orchestration: `Docker Compose`

---

## ✅ Feature Status

- Infrastructure
  - [x] `docker-compose` monorepo
  - [x] `Redis`, `Postgres` (pgvector), `MinIO`
- Ingestion
  - [x] Stream-based uploads (`UploadFile`) — minimal memory usage
  - [x] UUID-based filenames, S3 (MinIO) persistence
- Async Processing
  - [x] `Celery` task queue and `task_id`-based status tracking
- AI Pipeline (completed)
  - [x] FFmpeg audio extraction (static binary in worker)
  - [x] Groq Whisper transcription (`whisper-large-v3`)
  - [x] FastEmbed vector generation (`BAAI/bge-small-en-v1.5`)
  - [x] AI insights via Groq Llama 3 (structured JSON)
  - [x] Vector storage with `pgvector` and HNSW index for fast retrieval
- Frontend
  - [x] `Next.js` UI with Clerk auth and upload/search flows

---

## 🛠 Installation & Setup

### Prerequisites
- Docker Desktop (or Docker + Docker Compose)
- A `GROQ_API_KEY` (Groq account) for transcription & LLM calls
- (Optional) `STRIPE` and `CLERK` keys if you intend to use billing/auth features

### Clone the repository

```insightstream/README.md#L150-153
git clone https://github.com/YOUR_USERNAME/insightstream.git
cd insightstream
```

### Configure Environment — create a `.env` file at the project root (example)

```insightstream/README.md#L155-196
# Postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=insightstream
DATABASE_URL=postgresql://user:password@db:5432/insightstream

# Redis
REDIS_URL=redis://redis:6379/0

# MinIO (S3)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_ENDPOINT_URL=http://minio:9000
AWS_BUCKET_NAME=videos

# Groq (for transcription + LLM)
GROQ_API_KEY=your_groq_api_key_here

# Optional (Clerk, Stripe, Svix)
CLERK_ISSUER=...
CLERK_WEBHOOK_SECRET=...
STRIPE_API_KEY=...
STRIPE_WEBHOOK_KEY=...
SVIX_SECRET=...

# Worker tuning
OMP_NUM_THREADS=1
MKL_NUM_THREADS=1
```

> Security: Do not commit `.env` to the repo. Add it to `.gitignore`.

### Launch core services

```insightstream/README.md#L200-203
docker-compose up --build
```

- The `worker` image includes an optimized static `ffmpeg` binary (no in-container apt installs).
- The `db` service uses a `pgvector`-enabled image; backend code performs `CREATE EXTENSION IF NOT EXISTS vector` on startup.

### Run Frontend (local development)

```insightstream/README.md#L206-210
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📂 Project Structure (high level)

```insightstream/README.md#L214-244
insightstream/
├── docker-compose.yaml           # Services: redis, db (pgvector), minio, backend, worker
├── backend/                      # FastAPI gateway and API
│   └── app/
│       ├── core/                 # config, settings
│       ├── database/             # models.py, config.py (create_extension)
│       ├── services/             # semantic_search.py (fastembed based)
│       └── main.py               # FastAPI app entrypoint
├── worker/                       # Celery worker & AI pipeline
│   ├── Dockerfile                # copies static ffmpeg binary
│   └── app/
│       ├── core/
│       │   └── model_loader.py   # loads fastembed & groq clients
│       ├── helpers/
│       │   └── video_processing.py # audio extraction, transcription, embeddings, AI insights
│       └── worker.py             # Celery tasks
├── frontend/                     # Next.js + Clerk UI
│   └── package.json
```

Key files to inspect and modify:
- `worker/app/helpers/video_processing.py` — Groq transcription, FastEmbed embedding, Llama insights
- `worker/app/core/model_loader.py` — loads `fastembed.TextEmbedding` and `groq.Groq` client
- `worker/Dockerfile` — copies static `ffmpeg` binary into image
- `backend/app/database/models.py` — `Video` and `VideoSegment` models with `Vector(384)` embedding column and HNSW index
- `backend/app/services/semantic_search.py` — query embedding + DB nearest-neighbor search

---

## 📡 API Examples

Upload a video (multipart/form-data):

```insightstream/README.md#L250-260
curl -X POST "http://localhost:8000/api/v1/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@my_video.mp4;type=video/mp4"
```

Typical upload response:

```insightstream/README.md#L262-270
{
  "status": "queued",
  "video_id": "550e8400-e29b-41d4-a716-446655440000.mp4",
  "task_id": "8756c9a7-9800-4593-b23d-176882647d32",
  "message": "Video uploaded and processing started."
}
```

Search the transcript (semantic search):

```insightstream/README.md#L272-281
curl -G "http://localhost:8000/api/v1/search" \
  --data-urlencode "q=product roadmap discussion" \
  --data-urlencode "limit=5" \
  -H "accept: application/json" \
  -H "Authorization: Bearer <user_token>"
```

Search responses return matching `VideoSegment` objects with `start_time`, `end_time`, `content`, and similarity info.

---

## 🔬 Models & Indexing Notes

- Transcription: Groq Whisper (`whisper-large-v3`) endpoint is used in `video_processing.generate_transcription`.
- Embeddings: `fastembed.TextEmbedding(model_name="BAAI/bge-small-en-v1.5")` is used in both worker and backend to ensure a consistent vector space.
- Vector storage: `pgvector` stores fixed-size vectors; the code sets `Vector(384)` and an HNSW index with tuned parameters (`m`, `ef_construction`) for performance.
- AI insights: Groq Llama 3 (`llama-3.1-8b-instant`) is used to create structured JSON summaries and action items.
- Worker performance: `OMP_NUM_THREADS` and `MKL_NUM_THREADS` are set to `1` in container env to prevent CPU oversubscription when running numeric workloads.

---

## 🤝 Contributing

- Branching model: work from `develop`, open PRs into `develop`.
- For model or pipeline updates, update `worker/app/core/model_loader.py`, add tests, and document behavior.
- If you change embedding model or vector dimension, update `backend/app/database/models.py` (`Vector(...)`) and DB migration scripts accordingly.

---

## License & Security Notes

- Add a `LICENSE` file to the repo and update the badge at the top.
- Never commit `.env` or API keys to source control.
- Groq API usage may incur cost — monitor usage and set rate limits if needed.
- When enabling external webhooks (Clerk, Stripe), secure and verify webhook payloads (the project includes `svix` for webhook security).

---

If you'd like, I can:
- Create this README file in the repository for you, or
- Produce a focused "What's changed" diff to review only the modifications.

If you want me to write the README into the repository now, tell me and I will proceed.