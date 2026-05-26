# CollegeHunt Backend - Deployment to Railway

**Live API URL:** [Will be generated after deployment]

## One-Click Railway Deployment

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- This repository (public or private)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CollegeHunt backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/collegehunt-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your `collegehunt-backend` repository
4. Railway auto-detects Node.js project

### Step 3: Configure PostgreSQL

1. In Railway dashboard, click "Add" → "Add Database" → "PostgreSQL"
2. PostgreSQL container is created automatically
3. Railway injects `DATABASE_URL` environment variable

### Step 4: Set Environment Variables

In Railway Project Settings → Variables, add:

```
ADMIN_API_KEY=your-secure-admin-key-here
NODE_ENV=production
```

Railway automatically provides:
- `DATABASE_URL` (from PostgreSQL plugin)
- `PORT` (default 3000)

### Step 5: Deploy!

```bash
# Push to GitHub and Railway auto-deploys
git push origin main
```

**View deployment:**
- Railway Dashboard → Domains → Copy your `*.railway.app` URL
- Example: `https://collegehunt-backend-production.railway.app`

### Step 6: Run Migrations on Railway

Railway provides a shell for running commands:

1. Click on your app in Railway
2. Click "Shell" tab
3. Run:
```bash
npm run prisma:migrate
npm run prisma:seed
```

Or add to your `package.json` post-deployment hook.

## Verify Deployment

```bash
# Test health endpoint
curl https://your-railway-url/health

# Test API
curl "https://your-railway-url/api/colleges?limit=3"
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-26T10:00:00Z"
}
```

## Database Backups

Railway automatically backs up PostgreSQL data. Access via:
1. Railway Dashboard → PostgreSQL → Backups
2. Download or restore from snapshots

## Monitoring & Logs

View real-time logs:
```bash
# Via Railway CLI
railway logs
```

Or in Dashboard → Logs tab.

## Custom Domain (Optional)

1. Railway → Project → Settings → Domains
2. Add custom domain
3. Update DNS records (CNAME pointing to Railway)

## Cost Estimate

Railway free tier includes:
- ✅ 5 GB PostgreSQL storage
- ✅ 100 GB bandwidth
- ✅ Generous compute hours
- ✅ Public API access

Paid tiers start at $5/month.

## Troubleshooting

### Build fails with "npm install" error
**Solution:**
```bash
# Clear Railway build cache and redeploy
```

### Database connection refused
**Solution:**
1. Check `DATABASE_URL` is set in Railway
2. Ensure PostgreSQL plugin is added
3. Verify schema migrations ran: `railway sh`

### API returns 404
**Solution:**
```bash
# Confirm routes are deployed correctly
curl https://your-railway-url/health

# Check logs for startup errors
railway logs
```

## Post-Deployment Checklist

✅ Health endpoint responds
✅ College search works (`/api/colleges`)
✅ Scoring endpoint works (`POST /api/score`)
✅ Reviews can be submitted (`POST /api/reviews/:id/create`)
✅ Admin endpoints protected (`x-admin-key` header required)
✅ Database has 15+ colleges (check via Prisma Studio or query)

## GitHub Actions CI/CD (Optional)

Add automatic testing on push:

```yaml
# .github/workflows/test.yml
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run type-check
      - run: npm run test
```

## Environment-Specific Configuration

**Production (Railway):**
- `NODE_ENV=production`
- `DATABASE_URL=<Railway PostgreSQL>`
- `ADMIN_API_KEY=<secure-key>`

**Development (Local):**
- `NODE_ENV=development`
- `DATABASE_URL=postgresql://localhost:5432/collegehunt_db`
- `ADMIN_API_KEY=test-key-123`

**Test:**
- `NODE_ENV=test`
- Uses in-memory database (if configured)

---

## Quick Deploy Summary

1. Push to GitHub: `git push origin main`
2. Connect to Railway: New Project → Deploy from GitHub
3. Add PostgreSQL: New Database → PostgreSQL
4. Set environment variables: `ADMIN_API_KEY`, `NODE_ENV`
5. Run migrations in Railway shell: `npm run prisma:migrate && npm run prisma:seed`
6. Copy your `.railway.app` URL
7. Test endpoints with live URL

**Done! API is live. 🚀**
