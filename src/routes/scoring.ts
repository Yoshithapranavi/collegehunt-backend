import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { calculateScore } from '../lib/scoring.js';

export const scoreRoutes = new Hono();

const scoreCache = new Map<string, { timestamp: number; payload: any }>();
const rateLimitWindowMs = 60_000;
const maxScoreRequestsPerWindow = 30;
const scoreRateLimit = new Map<string, { count: number; resetAt: number }>();

const ScoreRequestSchema = z.object({
    weights: z.object({
        placement: z.number().min(0).max(1),
        fees: z.number().min(0).max(1),
        location: z.number().min(0).max(1),
    }),
    filters: z.object({
        stream: z.string().optional(),
        city: z.string().optional(),
    }).optional(),
});

type ScoreRequest = z.infer<typeof ScoreRequestSchema>;

function getClientIp(c: any) {
    const forwarded = c.req.header('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return c.req.header('x-real-ip') || c.req.header('cf-connecting-ip') || 'unknown';
}

function getScoreCacheKey(body: ScoreRequest) {
    return JSON.stringify(body);
}

function checkRateLimit(ip: string) {
    const now = Date.now();
    const current = scoreRateLimit.get(ip);

    if (!current || current.resetAt <= now) {
        scoreRateLimit.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
        return { allowed: true };
    }

    if (current.count >= maxScoreRequestsPerWindow) {
        return {
            allowed: false,
            retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
        };
    }

    current.count += 1;
    scoreRateLimit.set(ip, current);
    return { allowed: true };
}

// POST /api/score - Calculate weighted college scores
scoreRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { weights, filters } = ScoreRequestSchema.parse(body);
        const clientIp = getClientIp(c);

        const rateLimitResult = checkRateLimit(clientIp);
        if (!rateLimitResult.allowed) {
            return c.json(
                { error: 'Rate limit exceeded for /score' },
                429,
                { 'Retry-After': String(rateLimitResult.retryAfterSeconds || 60) }
            );
        }

        const cacheKey = getScoreCacheKey({ weights, filters });
        const cached = scoreCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 5 * 60_000) {
            return c.json({ ...cached.payload, cached: true });
        }

        // Normalize weights to sum to 1
        const totalWeight = weights.placement + weights.fees + weights.location;
        const normalizedWeights = {
            placement: weights.placement / totalWeight,
            fees: weights.fees / totalWeight,
            location: weights.location / totalWeight,
        };

        // Get all colleges
        const allColleges = await prisma.college.findMany({
            include: {
                courseFees: true,
                placementStats: {
                    orderBy: { year: 'desc' },
                },
            },
        });

        // Apply filters in memory
        let colleges = allColleges;
        if (filters?.stream) {
            colleges = colleges.filter((c) => {
                try {
                    const streams = JSON.parse(c.streams || '[]');
                    return streams.includes(filters.stream);
                } catch {
                    return false;
                }
            });
        }
        if (filters?.city) {
            colleges = colleges.filter((c) =>
                c.city.toLowerCase().includes(filters.city?.toLowerCase() || '')
            );
        }

        // Calculate scores for each college
        const scoredColleges = colleges
            .map((college: any) => {
                const score = calculateScore(college, normalizedWeights);
                return {
                    id: college.id,
                    name: college.name,
                    city: college.city,
                    nirf_rank: college.nirf_rank,
                    overall_score: score.overall_score,
                    dimension_scores: score.dimension_scores,
                };
            })
            .sort((a: any, b: any) => b.overall_score - a.overall_score);

        const payload = {
            weights: normalizedWeights,
            colleges: scoredColleges,
            timestamp: new Date().toISOString(),
        };

        scoreCache.set(cacheKey, { timestamp: Date.now(), payload });

        if (scoreCache.size > 100) {
            const oldestKey = scoreCache.keys().next().value;
            if (oldestKey) scoreCache.delete(oldestKey);
        }

        return c.json(payload);
    } catch (error) {
        console.error('Error calculating scores:', error);
        return c.json({ error: 'Failed to calculate scores' }, 500);
    }
});

// POST /api/score/shortlist - Save shortlist for session
scoreRoutes.post('/shortlist', async (c) => {
    try {
        const { session_id, college_ids } = await c.req.json();

        if (!session_id || !Array.isArray(college_ids)) {
            return c.json(
                { error: 'session_id and college_ids array required' },
                400
            );
        }

        const shortlist = await prisma.shortlist.upsert({
            where: { session_id },
            update: { college_ids: JSON.stringify(college_ids), updatedAt: new Date() },
            create: { session_id, college_ids: JSON.stringify(college_ids) },
        });

        return c.json({
            session_id: shortlist.session_id,
            college_ids: JSON.parse(shortlist.college_ids),
            createdAt: shortlist.createdAt,
            updatedAt: shortlist.updatedAt,
        });
    } catch (error) {
        console.error('Error saving shortlist:', error);
        return c.json({ error: 'Failed to save shortlist' }, 500);
    }
});

// GET /api/score/shortlist/:session_id - Get shortlist for session
scoreRoutes.get('/shortlist/:session_id', async (c) => {
    try {
        const session_id = c.req.param('session_id');

        const shortlist = await prisma.shortlist.findUnique({
            where: { session_id },
        });

        if (!shortlist) {
            return c.json(
                { error: 'Shortlist not found' },
                404
            );
        }

        // Parse college_ids from JSON string
        const collegeIds = JSON.parse(shortlist.college_ids || '[]');

        // Get full college details
        const colleges = await prisma.college.findMany({
            where: { id: { in: collegeIds } },
            include: {
                placementStats: {
                    orderBy: { year: 'desc' },
                    take: 1,
                },
            },
        });

        return c.json({
            session_id,
            college_ids: collegeIds,
            colleges,
            createdAt: shortlist.createdAt,
            updatedAt: shortlist.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching shortlist:', error);
        return c.json({ error: 'Failed to fetch shortlist' }, 500);
    }
});
