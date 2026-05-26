# CollegeHunt Backend - Local Development Guide

## Prerequisites Check
- Node.js 18+ installed? `node --version`
- npm installed? `npm --version`
- PostgreSQL 14+ installed and running? `psql --version`

## Local Setup Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb collegehunt_db

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/collegehunt_db"
PORT=3000
NODE_ENV="development"
ADMIN_API_KEY="test-admin-key-123"
EOF
```

**Option B: Using Docker**
```bash
docker run -d \
  --name collegehunt-postgres \
  -e POSTGRES_DB=collegehunt_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15

# Then create .env with above DATABASE_URL
```

### Step 3: Run Migrations & Seed Data
```bash
npm run prisma:migrate  # Run Prisma migrations
npm run prisma:seed    # Seed 15+ colleges with data
```

### Step 4: Start Development Server
```bash
npm run dev
# Server starts at http://localhost:3000
```

### Step 5: Test API Endpoints

**Health check:**
```bash
curl http://localhost:3000/health
```

**List colleges:**
```bash
curl "http://localhost:3000/api/colleges?limit=5"
```

**Calculate scores:**
```bash
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "weights": {"placement": 0.6, "fees": 0.3, "location": 0.1}
  }'
```

## Common Issues & Solutions

### Issue: "Connection refused" (PostgreSQL)
**Solution:**
```bash
# Check if PostgreSQL is running
psql -U postgres

# If not running:
# On Mac: brew services start postgresql
# On Windows: Start PostgreSQL from Services
# On Linux: sudo systemctl start postgresql
```

### Issue: "Database doesn't exist"
**Solution:**
```bash
createdb collegehunt_db
npm run prisma:migrate
npm run prisma:seed
```

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Change PORT in .env to 3001 (or another free port)
# Or kill the process using port 3000:
# Mac/Linux: lsof -ti:3000 | xargs kill -9
# Windows: netstat -ano | findstr :3000 (then taskkill /PID <PID>)
```

## Testing Commands

### Run Unit Tests
```bash
npm run test           # Run once
npm run test:watch    # Watch mode
```

### Type Check
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
npm start              # Run compiled version
```

## Database Management

### View Database
```bash
psql collegehunt_db

# Inside psql:
\dt                    # List tables
SELECT COUNT(*) FROM "College";  # Count colleges
\q                     # Exit
```

### Reset Database (⚠️ Caution!)
```bash
npm run prisma:reset   # Drops all data and re-runs migrations
```

### Prisma Studio (GUI)
```bash
npx prisma studio     # Opens web UI at http://localhost:5555
```

## API Testing with Postman/Insomnia

**Import this collection:**

1. Create POST request to `http://localhost:3000/api/score`
2. Headers: `Content-Type: application/json`
3. Body (JSON):
```json
{
  "weights": {
    "placement": 0.6,
    "fees": 0.3,
    "location": 0.1
  },
  "filters": {
    "stream": "Engineering"
  }
}
```

## Code Quality

### Run Linter
```bash
npm run lint
```

### Format Code (if using prettier)
```bash
npx prettier --write src/
```

## Production Deployment

See `DEPLOYMENT.md` for Railway setup.

---

**Need help?** Check the README.md for full API docs.
