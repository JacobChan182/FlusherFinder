#!/bin/bash

# FlushFinder - Start All Services
# This script starts PostgreSQL, the API server, and the frontend

echo "🚀 Starting FlushFinder..."

# Check if PostgreSQL is already running
if ! pg_isready -q; then
    echo "📊 Starting PostgreSQL..."
    brew services start postgresql@14
    sleep 2
else
    echo "✅ PostgreSQL is already running"
fi

# Start API in background
echo "🔌 Starting API server..."
cd apps/api
source $HOME/.local/bin/env && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/flushfinder-api.log 2>&1 &
API_PID=$!
echo "✅ API started (PID: $API_PID)"

# Start Frontend in background
cd ../../frontend
echo "🎨 Starting frontend..."
npm start > /tmp/flushfinder-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

# Wait a moment for services to start
sleep 3

# Verify services are running
echo ""
echo "🔍 Checking services..."

if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ API is running at http://localhost:8000"
else
    echo "❌ API is not responding"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⏳ Frontend is starting..."
fi

echo ""
echo "🎉 FlushFinder is starting!"
echo ""
echo "Access points:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔌 API: http://localhost:8000"
echo "  📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Logs:"
echo "  📝 API: tail -f /tmp/flushfinder-api.log"
echo "  📝 Frontend: tail -f /tmp/flushfinder-frontend.log"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo "To view running PIDs: ps aux | grep -E 'uvicorn|npm start'"
echo ""
echo "Press Ctrl+C to stop watching (services will continue running)"

# Wait for interrupt
wait
