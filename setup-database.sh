#!/bin/bash

# FlushFinder Database Setup Script (No Docker)
echo "🚀 Setting up FlushFinder database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Installing..."
    
    # Install PostgreSQL via Homebrew
    if command -v brew &> /dev/null; then
        brew install postgresql
        brew services start postgresql
    else
        echo "❌ Homebrew not found. Please install PostgreSQL manually:"
        echo "   https://www.postgresql.org/download/macosx/"
        exit 1
    fi
fi

# Create database and user
echo "📊 Creating database and user..."
psql postgres -c "CREATE DATABASE flushfinder;" 2>/dev/null || echo "Database may already exist"
psql postgres -c "CREATE USER flushfinder_user WITH PASSWORD 'flushfinder_password';" 2>/dev/null || echo "User may already exist"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE flushfinder TO flushfinder_user;"

# Install PostGIS extension
echo "🗺️ Installing PostGIS extension..."
psql flushfinder -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
psql flushfinder -c "CREATE EXTENSION IF NOT EXISTS \"postgis\";"

# Run database initialization
echo "📋 Initializing database schema..."
psql flushfinder -f init.sql

echo "✅ Database setup complete!"
echo "🔗 Connection details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: flushfinder"
echo "   User: flushfinder_user"
echo "   Password: flushfinder_password"
