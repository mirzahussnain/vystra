# InsightStream 🎥

[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-Add%20LICENSE-lightgrey.svg)](#license)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](#)

> **AI-Powered Video Search Engine & SaaS Platform**

✨✨✨

InsightStream is a scalable microservices application that transforms opaque video content into searchable knowledge. Users upload videos, and the system uses OpenAI Whisper (AI) to transcribe audio, generates vector embeddings, and enables semantic search through video content.

---

## Table of Contents

- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Features (Current Status)](#-features-current-status)
- [Installation & Setup](#-installation--setup)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Configure Environment](#configure-environment)
  - [Launch the System](#launch-the-system)
  - [Access the Application](#access-the-application)
- [Project Structure](#-project-structure)
- [API Usage Example](#-api-usage-example)
- [Contributing](#-contributing)
- [License & Notes](#license--notes)

---

## 🏗 Architecture & Tech Stack

The system follows an **Asynchronous Microservices Architecture** tailored for heavy AI workloads.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **API Gateway** | **FastAPI** (Python) | Handles auth, uploads, and search requests. |
| **Async Worker** | **Celery** | Distributed task queue for heavy AI processing. |
| **Message Broker** | **Redis** | Manages communication between API and Workers. |
| **Storage (Object)** | **MinIO (S3)** | Stores raw video files (Dockerized S3 clone). |
| **Storage (Data)** | **PostgreSQL** | Relational data (users, metadata). |
| **AI Model** | **OpenAI Whisper** | State-of-the-art speech-to-text transcription. |
| **Infrastructure** | **Docker Compose** | Orchestration and containerization. |

---

## 🚀 Features (Current Status)

### ✅ Phase 1: Infrastructure (Completed)
- [x] Monorepo setup with Docker Compose.
- [x] **Redis** & **PostgreSQL** integration.
- [x] **MinIO** (S3) local object storage setup.

### ✅ Phase 2: Video Ingestion (Completed)
- [x] **Stream-based Uploads:** API accepts video streams without overloading RAM (`UploadFile`).
- [x] **UUID Generation:** Collision-free file naming.
- [x] **S3 Integration:** Auto-creation of buckets and file persistence.

### ✅ Phase 3: Async Handoff (Completed)
- [x] **Celery Task Queue:** Decoupled API from Processing.
- [x] **Event Trigger:** Uploads automatically trigger background processing jobs.
- [x] **Status Tracking:** API returns a `task_id` for polling progress.

### 🚧 Phase 4: AI Intelligence (In Progress)
- [ ] FFmpeg Audio Extraction.
- [ ] Whisper Transcription.
- [ ] Vector Embedding Generation.

---

## 🛠 Installation & Setup

Prerequisites: **Docker Desktop** installed and running.

### Clone the Repository

```insightstream/README.md#L1-8
git clone https://github.com/YOUR_USERNAME/insightstream.git
cd insightstream
```

### Configure Environment — Create a `.env` file in the root directory (example):

```insightstream/README.md#L9-40
# Database
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
```

> Note: Do not commit your actual `.env` file to the repository. Add `.env` to `.gitignore`.

### Launch the System

```insightstream/README.md#L41-44
docker-compose up --build
```

### Access the Application

- API Docs (Swagger): http://localhost:8000/docs  
- MinIO Console: http://localhost:9001 (User/Pass: `minioadmin` / `minioadmin`)

---

## 📂 Project Structure

```
insightstream/
├── docker-compose.yaml   # Infrastructure Orchestration
├── backend/              # FastAPI Gateway
│   ├── app/
│   │   ├── routers.py    # API Endpoints
│   │   ├── storage.py    # S3 Connectors
│   │   └── main.py       # App Entrypoint
├── worker/               # AI Processing Unit
│   ├── app/
│   │   └── worker.py     # Celery Task Definitions
```

---

## 📡 API Usage Example

Upload a Video:

```insightstream/README.md#L45-55
curl -X 'POST' \
  'http://localhost:8000/api/v1/upload' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@my_video.mp4;type=video/mp4'
```

Response:

```insightstream/README.md#L56-69
{
  "status": "queued",
  "video_id": "550e8400-e29b-41d4-a716-446655440000.mp4",
  "task_id": "8756c9a7-9800-4593-b23d-176882647d32",
  "message": "Video uploaded and processing started."
}
```

---

## 🤝 Contributing

- Switch to `develop` branch.  
- Create a feature branch: `git checkout -b feat/new-feature`.  
- Commit changes.  
- Open a Pull Request to `develop`.

---



✨ Thank you for using InsightStream! ✨
