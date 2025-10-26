# FlushFinder - Complete Setup Guide

This guide will help you set up and run the entire FlushFinder application on your desktop.

## 📋 Prerequisites

You'll need the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Homebrew** (MacOS) or **apt/yum** (Linux) or **Chocolatey** (Windows)

## 🚀 Quick Start

### Step 1: Install Prerequisites

#### macOS:
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Install Python and pip
brew install python@3.11
```

#### Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql-14

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Python and pip
sudo apt install python3.11 python3-pip
```

#### Windows:
```bash
# Using Chocolatey
choco install postgresql14
choco install python3

# Start PostgreSQL service
net start postgresql-x64-14
```

### Step 2: Clone and Setup Repository

```bash
# Navigate to your project directory
cd /path/to/your/project

# If you haven't already, initialize the database
./setup-database.sh
```

### Step 3: Install Python Dependencies

```bash
# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Activate uv in current session
source $HOME/.local/bin/env

# Navigate to API directory
cd apps/api

# Sync dependencies
uv sync

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://flushfinder_user:flushfinder_password@localhost:5432/flushfinder
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=43200
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
```

### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../../frontend

# Install npm packages
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF
```

## 🎯 Running the Application

You'll need **3 terminal windows** to run all components.

### Terminal 1: Database
```bash
# Start PostgreSQL (if not already running)
# macOS:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Windows:
net start postgresql-x64-14

# Verify it's running
psql -U flushfinder_user -d flushfinder -c "SELECT version();"
```

### Terminal 2: API Server
```bash
# Navigate to API directory
cd apps/api

# Activate uv
source $HOME/.local/bin/env

# Start the API server
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 3: Frontend
```bash
# Navigate to frontend directory
cd frontend

# Start React development server
npm start
```

You should see:
```
Compiled successfully!
You can now view frontend in the browser.
Local:            http://localhost:3000
```

## ✅ Verify Everything is Running

### Check Database
```bash
curl http://localhost:8000/health/db
```

Expected response:
```json
{"postgres":"PostgreSQL 14.19 ..."}
```

### Check API
```bash
curl http://localhost:8000/
```

Expected response:
```json
{"status":"ok"}
```

### Check Frontend
Open browser to: http://localhost:3000

## 📚 Useful Commands

### Database Commands
```bash
# Connect to database
psql -U flushfinder_user -d flushfinder

# View all users
psql -U flushfinder_user -d flushfinder -c "SELECT * FROM users;"

# View all restrooms
psql -U flushfinder_user -d flushfinder -c "SELECT * FROM restrooms;"

# Stop PostgreSQL
brew services stop postgresql@14  # macOS
sudo systemctl stop postgresql    # Linux
net stop postgresql-x64-14        # Windows
```

### API Commands
```bash
# Stop API
pkill -f uvicorn

# Restart API
cd apps/api
source $HOME/.local/bin/env && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Commands
```bash
# Stop frontend (Ctrl+C in the terminal)
# Or:
pkill -f "npm start"

# Restart frontend
cd frontend && npm start
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>
```

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux
sc query postgresql-x64-14  # Windows

# Restart PostgreSQL
brew services restart postgresql@14  # macOS
sudo systemctl restart postgresql    # Linux
```

### API Not Starting
```bash
# Check if dependencies are installed
cd apps/api
uv sync

# Check if .env file exists
cat .env

# Check logs for errors
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
```

### Frontend Not Loading
```bash
# Clear npm cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is available
lsof -i :3000
```

## 🎯 One-Line Start Scripts

### Start Everything (macOS/Linux)
```bash
# Save this as start-all.sh
#!/bin/bash

# Start PostgreSQL
brew services start postgresql@14 &
sleep 2

# Start API
cd apps/api
source $HOME/.local/bin/env && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload &

# Start Frontend
cd ../../frontend
npm start &
```

### Stop Everything
```bash
# Save this as stop-all.sh
#!/bin/bash

# Stop PostgreSQL
brew services stop postgresql@14

# Stop API
pkill -f uvicorn

# Stop Frontend
pkill -f "npm start"
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

## 📖 Next Steps

1. Create an account at http://localhost:3000/signup
2. Log in at http://localhost:3000/login
3. Explore the map at http://localhost:3000/main
4. Check API documentation at http://localhost:8000/docs

Enjoy building with FlushFinder! 🚀
