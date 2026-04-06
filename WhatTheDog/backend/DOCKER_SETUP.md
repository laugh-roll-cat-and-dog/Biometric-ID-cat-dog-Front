# WhatTheDog Backend - Docker Setup

This backend uses Docker Compose to run PostgreSQL database and FastAPI API in containers.

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose (included with Docker Desktop)
- Python 3.11+ (for local development without Docker)

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
cp .env.example .env
```

### 2. Build and Start Containers

```bash
docker-compose up --build
```

This will:

- Create and start PostgreSQL container
- Initialize database with schema from `init.sql`
- Build and start the FastAPI API container
- Expose API at `http://localhost:8000`
- Expose database at `localhost:5432`

### 3. Verify Everything is Running

```bash
# Check containers are running
docker-compose ps

# Test API health
curl http://localhost:8000/health

# Check database connection
docker-compose exec postgres psql -U whatthedog -d whatthedog_db -c "SELECT 1"
```

## 🛑 Stop Containers

```bash
docker-compose down
```

### Keep Database Data

```bash
docker-compose down  # Data persists in postgres_data volume
```

### Remove Everything (Including Database)

```bash
docker-compose down -v
```

## 📊 Database Access

### From Host Machine

```bash
# Connect to PostgreSQL
psql -h localhost -U whatthedog -d whatthedog_db

# When prompted, password is: whatthedog_password
```

### From Inside Container

```bash
docker-compose exec postgres psql -U whatthedog -d whatthedog_db
```

## 🐛 Troubleshooting

### Port Already in Use

If port 5432 or 8000 is already in use, edit `docker-compose.yml`:

```yaml
postgres:
  ports:
    - "5433:5432" # Change left number (host port)

api:
  ports:
    - "8001:8000" # Change left number (host port)
```

### Database Connection Issues

```bash
# Check logs
docker-compose logs postgres
docker-compose logs api

# Check health
docker-compose exec postgres pg_isready -U whatthedog
```

### Rebuild After Changes

```bash
docker-compose up --build --force-recreate
```

## 📁 Volumes

- **postgres_data**: Persists database files
- **./app**: Syncs Python code for hot-reload
- **./storage**: Syncs image storage directory

## 🔄 Update Frontend API Configuration

Update your React Native app's API configuration to use the containerized backend:

**config/api.ts:**

```typescript
export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",  // For local testing
  // or use ngrok for external access
  // BASE_URL: "https://your-ngrok-url.ngrok-free.dev",
  ...
}
```

## 🌐 Production Deployment

For production, you can:

1. **Push to Docker Hub:**

   ```bash
   docker build -t yourusername/whatthedog-api .
   docker push yourusername/whatthedog-api
   ```

2. **Deploy to cloud:** AWS ECS, Google Cloud Run, DigitalOcean, etc.

3. **Use environment variables for secrets:**
   ```bash
   docker-compose -f docker-compose.prod.yml up
   ```

## 📝 Database Schema

Tables are automatically created on first run via `init.sql`:

- **dogs**: Main dog records (id, name, breed, age, description)
- **dog_images**: Image references linked to dogs

## 🔗 Docker Network

Services communicate via `whatthedog_network`:

- API container connects to `postgres:5432`
- Frontend connects to API at `localhost:8000`
