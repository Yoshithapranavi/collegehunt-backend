#!/bin/sh

echo "🚀 Starting CollegeHunt Backend..."

# Run migrations (non-blocking on failure)
npx prisma migrate deploy 2>/dev/null || echo "Migrations already applied or skipped"

# Seed database (non-blocking on failure)
npx prisma db seed 2>/dev/null || echo "Seeding skipped"

# Start the application
echo "✅ Starting application on port ${PORT:-3000}..."
exec node dist/index.js
