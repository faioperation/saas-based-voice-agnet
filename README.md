# FireVoice AI — Docker Setup

A complete AI-driven voice ordering and calling platform with Docker support.

---

## Project Overview

| Service    | Technology          | Port |
|------------|---------------------|------|
| Frontend   | React + Vite + Nginx| 3000 |
| Backend    | Node.js + Express   | 8000 |
| AI Service | Python FastAPI      | 8001 |
| Database   | PostgreSQL 16       | 5432 |

> **Redis** is an external cloud service (RedisLabs). No local Redis container is used.

---

## Requirements

Before running, make sure you have installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Ensure Docker Desktop is **running** before executing any commands

---

## Docker Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates all 4 services together |
| `Backend/Dockerfile` | Builds the Node.js backend image (includes Chromium for Puppeteer/PDF) |
| `Backend/.dockerignore` | Excludes unnecessary files from the backend build context |
| `frontend/Dockerfile` | Multi-stage build: Vite build → Nginx static server |
| `frontend/.dockerignore` | Excludes node_modules and dist from frontend build context |
| `ai/Dockerfile` | Builds the Python FastAPI AI service image |
| `ai/.dockerignore` | Excludes venv and cache from the AI build context |

---

## Switching Between Local and Production

Before you build, open `docker-compose.yml` and find the two switchable sections.

### Frontend API URL

```yaml
# ✅ LOCAL DEVELOPMENT (default):
VITE_API_BASE_URL: http://localhost:8000/api

# 🚀 PRODUCTION — comment line above, uncomment this:
# VITE_API_BASE_URL: https://your-production-domain.com/api
```

### Backend AI Service URL

```yaml
# ✅ LOCAL DEVELOPMENT (default):
AI_SERVICE_URL: http://ai:8001

# 🚀 PRODUCTION — comment line above, uncomment this:
# AI_SERVICE_URL: https://your-ai-domain.com
```

> ⚠️ `VITE_API_BASE_URL` is **baked into the frontend JS bundle at build time**.
> After switching, you must **rebuild** the frontend image:
> ```bash
> docker compose build frontend
> ```

---

## Build

Build all Docker images (run this once, or after any code change):

```bash
docker compose build
```

Build a specific service only:

```bash
docker compose build backend
docker compose build frontend
docker compose build ai
```

---

## Run

Start all services in the background:

```bash
docker compose up -d
```

Start and watch logs in the terminal (foreground):

```bash
docker compose up
```

### First Run Startup Order

When containers start for the first time, the backend automatically:
1. Waits for PostgreSQL to be healthy
2. Runs `prisma migrate deploy` — applies all 25 database migrations
3. Runs `node prisma/seed.js` — seeds default users and subscription plans
4. Starts the Express server

### Accessing the Application

| URL | Service |
|-----|---------|
| http://localhost:3000 | Frontend (React App) |
| http://localhost:8000 | Backend API |
| http://localhost:8000/api | Backend API Base |
| http://localhost:8001 | AI FastAPI Service |

---

## Stop

Stop all running containers (data is preserved):

```bash
docker compose down
```

Stop and **remove all data** (PostgreSQL volume deleted — fresh start):

```bash
docker compose down -v
```

---

## Restart

Restart all services:

```bash
docker compose restart
```

Restart a specific service:

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart ai
```

---

## Logs

View logs for all services:

```bash
docker compose logs
```

Follow live logs (stream):

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f ai
docker compose logs -f postgres
```

View last 50 lines:

```bash
docker compose logs --tail=50 backend
```

---

## Prisma

Prisma is managed entirely inside the backend container.

### How it works in Docker

- `prisma generate` runs at **image build time** (inside `Dockerfile`)
- `prisma migrate deploy` runs at **container startup** (in `docker-compose.yml` command)
- Migrations are applied using the existing migration files in `Backend/prisma/migrations/`

### Run Prisma commands manually

Open a shell in the backend container:

```bash
docker compose exec backend sh
```

Then run any Prisma command:

```bash
npx prisma migrate deploy
npx prisma migrate status
npx prisma studio
npx prisma db push
```

### Check migration status

```bash
docker compose exec backend npx prisma migrate status
```

---

## Database Seed

The seed runs **automatically every time** the backend container starts.

It uses `upsert` operations — so it is completely **idempotent** (safe to run multiple times with no duplicate data).

### What the seed creates

| Item | Details |
|------|---------|
| System Owner | `system@test.com` / `123456` |
| Business Owner | `user@test.com` / `123456` |
| Business | "New business" linked to Business Owner |
| Business Settings | Name + address configured |
| Subscription Plans | Free Trial, Starter ($49), Growth ($99), Pro ($149), Enterprise |

### Run seed manually

```bash
docker compose exec backend node prisma/seed.js
```

### Run the order seed (optional test data)

```bash
docker compose exec backend node prisma/seed-order.js
```

---

## Troubleshooting

### Backend fails to start: "Missing environment variable"

The backend validates required env vars on startup. Ensure `Backend/.env` exists and contains all required variables:
- `PORT`, `NODE_ENV`, `JWT_SECRET_TOKEN`, `JWT_REFRESH_TOKEN`
- `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `DATABASE_URL`, `BACKEND_URL`, `REDIS_URL`, `FRONT_END_URL`
- `AI_SERVICE_URL`, `VAPI_API_KEY`

### Backend cannot connect to PostgreSQL

The backend waits for the postgres healthcheck, but if you see connection errors:

```bash
docker compose logs postgres
docker compose restart backend
```

### Frontend shows old API URL after switching to production

`VITE_API_BASE_URL` is baked at build time. After editing `docker-compose.yml`, always rebuild:

```bash
docker compose build frontend
docker compose up -d frontend
```

### AI service pip install fails (pywin32 error)

The Dockerfile already filters out `pywin32==311` (Windows-only). If another package fails, check the AI service logs:

```bash
docker compose logs ai
```

### PostgreSQL volume already exists with old data

To start completely fresh:

```bash
docker compose down -v
docker compose up -d
```

### Puppeteer / PDF generation fails inside container

The backend Dockerfile installs system Chromium and sets:
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```
The `pdfGenerator.js` already uses `--no-sandbox` and `--disable-setuid-sandbox` which is required for Docker. If it still fails, check:

```bash
docker compose exec backend chromium --version
```

### Google OAuth does not work locally

The `GOOGLE_CALLBACK_URL` in `Backend/.env` must match an authorized redirect URI in your Google Cloud Console. For local Docker, update it to `http://localhost:8000/auth/google/callback` and register that URI in Google Cloud.

---

## Useful Docker Commands

```bash
# List running containers
docker compose ps

# Open a terminal inside a container
docker compose exec backend sh
docker compose exec ai bash
docker compose exec postgres psql -U postgres -d Fire_Voice

# Rebuild a single service after code changes
docker compose build backend && docker compose up -d backend

# View resource usage (CPU, memory)
docker stats

# Remove unused images to free disk space
docker image prune

# Remove everything (containers, images, volumes, networks)
docker compose down -v
docker system prune -a
```
