#!/bin/sh

echo "🚀 Starting CollegeHunt Backend..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    exit 1
fi

echo "✅ DATABASE_URL is configured"
echo "✅ Starting application on port ${PORT:-3000}..."

# Start the application directly (no migrations in production)
exec node dist/index.js
