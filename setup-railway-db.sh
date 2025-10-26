#!/bin/bash

echo "🚀 Railway PostgreSQL Setup Script"
echo "===================================="
echo ""
echo "This script will help you set up the washroom tables in Railway."
echo ""
echo "You'll need:"
echo "1. Your Railway DATABASE_URL (from Railway → PostgreSQL → Variables)"
echo ""

read -p "Enter your Railway DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL cannot be empty"
    exit 1
fi

echo ""
echo "📋 Running SQL script to create tables..."
echo ""

# Read the SQL file and execute it
psql "$DATABASE_URL" < railway-washroom-schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Tables created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Go to Railway → Your API service"
    echo "2. Click 'Deployments' → 'Redeploy'"
    echo "3. Test your app at https://flusherfinder.web.app"
else
    echo ""
    echo "❌ Error: Failed to create tables"
    echo "Please check your DATABASE_URL and try again"
fi
