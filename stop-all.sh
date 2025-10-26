#!/bin/bash

# FlushFinder - Stop All Services
# This script stops PostgreSQL, the API server, and the frontend

echo "🛑 Stopping FlushFinder services..."

# Stop API
echo "🔌 Stopping API server..."
pkill -f "uvicorn src.main:app"
if [ $? -eq 0 ]; then
    echo "✅ API stopped"
else
    echo "ℹ️  API was not running"
fi

# Stop Frontend
echo "🎨 Stopping frontend..."
pkill -f "npm start"
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend was not running"
fi

# Stop PostgreSQL (optional - comment out if you want to keep it running)
# echo "📊 Stopping PostgreSQL..."
# brew services stop postgresql@14
# echo "✅ PostgreSQL stopped"

echo ""
echo "✅ All services stopped!"
echo ""
echo "To start services again, run: ./start-all.sh"
