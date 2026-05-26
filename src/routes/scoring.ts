import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index';
import { calculateScore } from '../lib/scoring';

export const scoreRoutes = new Hono();

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

// POST /api/score - Calculate weighted college scores
scoreRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { weights, filters } = ScoreRequestSchema.parse(body);

        // Normalize weights to sum to 1
        const totalWeight = weights.placement + weights.fees + weights.location;
        const normalizedWeights = {
            placement: weights.placement / totalWeight,
            fees: weights.fees / totalWeight,
            location: weights.location / totalWeight,
        };

        // Get colleges based on filters
        const where: any = {};
        if (filters?.stream) {
            where.streams = { has: filters.stream };
        }
        if (filters?.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }

        const colleges = await prisma.college.findMany({
            where,
            include: {
                courseFees: true,
                placementStats: {
                    orderBy: { year: 'desc' },
                    take: 1,
                },
            },
        });

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

        return c.json({
            weights: normalizedWeights,
            colleges: scoredColleges,
            timestamp: new Date().toISOString(),
        });
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
            update: { college_ids, updatedAt: new Date() },
            create: { session_id, college_ids },
        });

        return c.json(shortlist);
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

        // Get full college details
        const colleges = await prisma.college.findMany({
            where: { id: { in: shortlist.college_ids } },
            include: {
                placementStats: {
                    orderBy: { year: 'desc' },
                    take: 1,
                },
            },
        });

        return c.json({
            session_id,
            college_ids: shortlist.college_ids,
            colleges,
            createdAt: shortlist.createdAt,
            updatedAt: shortlist.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching shortlist:', error);
        return c.json({ error: 'Failed to fetch shortlist' }, 500);
    }
});
