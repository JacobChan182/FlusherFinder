# FlushFinder - Quick Start Guide

## 🚀 One-Command Start

```bash
./start-all.sh
```

This will start:
- PostgreSQL database
- API server (port 8000)
- Frontend (port 3000)

## 🛑 One-Command Stop

```bash
./stop-all.sh
```

## 📋 Manual Start (3 Terminal Windows)

### Terminal 1: Database
```bash
brew services start postgresql@14
```

### Terminal 2: API
```bash
cd apps/api
source $HOME/.local/bin/env && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 3: Frontend
```bash
cd frontend
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## ✅ Verify Services

```bash
# Check API
curl http://localhost:8000/

# Check database
curl http://localhost:8000/health/db
```

## 🔍 Useful Commands

### View Logs
```bash
# API logs
tail -f /tmp/flushfinder-api.log

# Frontend logs
tail -f /tmp/flushfinder-frontend.log
```

### Check Running Services
```bash
ps aux | grep -E 'uvicorn|npm start|postgres'
```

### Kill Processes
```bash
pkill -f "uvicorn src.main:app"
pkill -f "npm start"
```

## 📖 Full Documentation

See [README-SETUP.md](README-SETUP.md) for complete setup instructions.
