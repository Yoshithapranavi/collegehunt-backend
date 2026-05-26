#!/bin/sh

echo "🚀 Starting CollegeHunt Backend..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy || true

# Seed database if needed
echo "🌱 Seeding database..."
npx prisma db seed || true

# Start the application
echo "✅ Starting application..."
node dist/index.js
