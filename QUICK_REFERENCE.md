# CollegeHunt Backend - Quick Reference

## 🚀 30-Second Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env: Add your PostgreSQL connection string

# 2. Install & Setup
npm install
npm run prisma:migrate
npm run prisma:seed

# 3. Start development
npm run dev
# Server at http://localhost:3000
```

## 📍 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/colleges` | GET | Search & filter colleges |
| `/api/colleges/:id` | GET | College details |
| `/api/score` | POST | Calculate weighted scores |
| `/api/reviews/:id/create` | POST | Submit review |
| `/api/reviews/:id` | GET | Get reviews |
| `/api/admin/stats` | GET | Dashboard (API key) |

## 🔑 Headers

**Admin endpoints require:**
```
x-admin-key: <ADMIN_API_KEY from .env>
```

## 💾 Database Models

```prisma
College          ← CourseFee
                 ← PlacementStat
                 ← AdmissionCutoff
                 ← Review
Shortlist        (session-based, no relations)
```

## 🧮 Scoring Dimensions

1. **Placement** (0-100): Based on avg package
2. **Fees** (0-100): Inverted (lower is better)
3. **Location** (0-100): Tier-based

Formula: `score = p*w1 + f*w2 + l*w3` (weights normalized to sum=1)

## 🎓 Seeded Colleges (15)

| #  | College | Tier | Placement | Fees |
|----|---------|------|-----------|------|
| 1  | IIT Delhi | Govt | 28.5L | 16k |
| 2  | IIT Bombay | Govt | 29.2L | 16k |
| 3  | IIT Madras | Govt | 27.8L | 16k |
| 4  | NIT Trichy | Govt | 12.5L | 12.5k |
| 5  | DTU Delhi | Govt | 10.2L | 18k |
| 6  | BITS Pilani | Pvt | 22.5L | 280k |
| 7  | Manipal | Pvt | 16.5L | 225k |
| 8  | VIT Vellore | Pvt | 14.8L | 200k |
| 9  | Ashoka | Pvt | 18.5L | 280k |
| 10 | St. Stephens | Pvt | 14.2L | 95k |
| 11 | Christ Bangalore | Pvt | 15.8L | 150k |
| 12 | Miranda House | Govt | 12.5L | 32k |
| 13 | NLU Delhi | Govt | 15.5L | 50k |
| 14 | IIM Ahmedabad | Govt | 24.5L | 800k |

## 🔍 Filter Examples

```bash
# Engineering colleges in Delhi
?stream=Engineering&city=Delhi

# Private colleges under 300k fees
?type=Private&fees_max=300000

# Sort by placement
?sort=placement

# Pagination
?limit=10&offset=20
```

## 📮 Request Bodies

**Calculate Scores:**
```json
{
  "weights": {
    "placement": 0.6,
    "fees": 0.3,
    "location": 0.1
  },
  "filters": {
    "stream": "Engineering",
    "city": "Delhi"
  }
}
```

**Submit Review:**
```json
{
  "author_name": "John Doe",
  "batch_year": 2023,
  "stream": "B.Tech CS",
  "rating_overall": 4,
  "rating_placement": 5,
  "rating_faculty": 4,
  "rating_infra": 3,
  "body": "Great college with excellent placements..."
}
```

**Save Shortlist:**
```json
{
  "session_id": "user-session-123",
  "college_ids": [1, 2, 5]
}
```

## 🧪 Quick Tests

```bash
# Unit tests
npm run test

# Type check
npm run type-check

# Build
npm run build
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection error | Check `DATABASE_URL` in .env |
| Port 3000 in use | Change PORT in .env or kill process |
| Seed fails | Run `npm run prisma:migrate` first |
| Module not found | Run `npm install` |
| Type errors | Run `npm run type-check` |

## 📚 Documentation Files

- **README.md** - Full API docs
- **SETUP.md** - Local development
- **DEPLOYMENT.md** - Railway deployment
- **IMPLEMENTATION.md** - What's built

## 🚢 Deployment

1. Push to GitHub
2. Connect to Railway
3. Add PostgreSQL plugin
4. Set `ADMIN_API_KEY` env var
5. Run migrations in Railway shell
6. Copy `.railway.app` URL

## 📊 API Response Format

**Success:**
```json
{
  "data": [...],
  "pagination": { "limit": 20, "offset": 0, "total": 100 }
}
```

**Error:**
```json
{
  "error": "Description",
  "fieldErrors": { "field": "message" }
}
```

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://..."
PORT=3000
NODE_ENV=development
ADMIN_API_KEY=secure-key
```

## 💡 Pro Tips

1. Use Prisma Studio: `npx prisma studio`
2. Check logs: `npm run dev` and look at console
3. Test with curl: See examples in README.md
4. Admin key: Generate with `openssl rand -hex 32`
5. Session ID: Any unique string (UUID recommended)

## ✅ Pre-Submission Checklist

- [ ] `.env` configured with DATABASE_URL
- [ ] `npm install` completed
- [ ] `npm run prisma:migrate` successful
- [ ] `npm run prisma:seed` populated colleges
- [ ] `npm run dev` server runs
- [ ] `curl localhost:3000/health` returns 200
- [ ] API endpoints tested locally
- [ ] Tests pass: `npm run test`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Deployed to Railway (or ready to deploy)
- [ ] Live URL copied

---

**Questions?** Check the README or SETUP.md files.
