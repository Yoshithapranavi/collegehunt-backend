import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { getCareerTrends } from '../lib/career.js';

export const collegeRoutes = new Hono();

// Validation schemas
const FilterSchema = z.object({
    stream: z.string().optional(),
    city: z.string().optional(),
    type: z.string().optional(),
    fees_max: z.number().optional(),
    sort: z.enum(['rank', 'placement', 'fees', 'name']).optional().default('rank'),
    limit: z.number().optional().default(20),
    offset: z.number().optional().default(0),
});

type FilterInput = z.infer<typeof FilterSchema>;

function parseStreams(streams: string) {
    try {
        return JSON.parse(streams || '[]');
    } catch {
        return [];
    }
}

function buildComparison(colleges: any[]) {
    return {
        count: colleges.length,
        merged: colleges.map((college) => ({
            id: college.id,
            name: college.name,
            city: college.city,
            state: college.state,
            type: college.type,
            nirf_rank: college.nirf_rank,
            latest_fee: college.courseFees?.[0]?.annual_fee_inr ?? null,
            latest_placement: college.placementStats?.[0] ?? null,
            admission_cutoffs: college.admissionCutoffs || [],
        })),
    };
}

// Helper function to get colleges with filters
async function getCollegesWithFilters(filters: FilterInput) {
    // Get all colleges first (SQLite limitation)
    const allColleges = await prisma.college.findMany({
        include: {
            courseFees: true,
            placementStats: {
                orderBy: { year: 'desc' },
            },
        },
    });

    // Apply filters in memory
    let filtered = allColleges;

    if (filters.city) {
        filtered = filtered.filter((c) => c.city.toLowerCase().includes(filters.city?.toLowerCase() || ''));
    }

    if (filters.type) {
        filtered = filtered.filter((c) => c.type.toLowerCase().includes(filters.type?.toLowerCase() || ''));
    }

    if (filters.stream) {
        filtered = filtered.filter((c) => parseStreams(c.streams).includes(filters.stream));
    }

    // Sort
    if (filters.sort === 'rank') {
        filtered.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
    } else if (filters.sort === 'placement') {
        filtered.sort((a, b) => {
            const aPlacement = a.placementStats[0]?.avg_package || 0;
            const bPlacement = b.placementStats[0]?.avg_package || 0;
            return bPlacement - aPlacement;
        });
    } else if (filters.sort === 'fees') {
        filtered.sort((a, b) => {
            const aFee = a.courseFees[0]?.annual_fee_inr || 999999;
            const bFee = b.courseFees[0]?.annual_fee_inr || 999999;
            return aFee - bFee;
        });
    } else if (filters.sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply pagination
    const paginated = filtered.slice(filters.offset, filters.offset + filters.limit);

    return paginated;
}

// GET /api/colleges - List colleges with filters and search
collegeRoutes.get('/', async (c) => {
    try {
        const query = c.req.query();
        const filters = FilterSchema.parse({
            stream: query.stream,
            city: query.city,
            type: query.type,
            fees_max: query.fees_max ? parseInt(query.fees_max) : undefined,
            sort: query.sort,
            limit: query.limit ? parseInt(query.limit) : 20,
            offset: query.offset ? parseInt(query.offset) : 0,
        });

        // Build a Prisma where clause to push filtering into the DB when possible
        const where: any = {};

        if (filters.city) {
            where.city = { contains: filters.city } as any;
        }

        if (filters.type) {
            where.type = { contains: filters.type } as any;
        }

        if (filters.stream) {
            // streams is stored as JSON text like '["Engineering"]' — check for substring
            where.streams = { contains: filters.stream } as any;
        }

        if (query.q) {
            const q = String(query.q);
            where.OR = [
                { name: { contains: q } as any },
                { city: { contains: q } as any },
            ];
        }

        if (typeof filters.fees_max !== 'undefined') {
            where.courseFees = { some: { annual_fee_inr: { lte: filters.fees_max } } } as any;
        }

        // Fetch from DB with relations; keep sorting by more complex metrics in memory
        const dbColleges = await prisma.college.findMany({
            where,
            include: {
                courseFees: true,
                placementStats: { orderBy: { year: 'desc' } },
            },
        });

        // Sort in memory for placement/name/fees/rank options
        let results = dbColleges;

        if (filters.sort === 'rank') {
            results.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
        } else if (filters.sort === 'placement') {
            results.sort((a, b) => {
                const aPlacement = a.placementStats[0]?.avg_package || 0;
                const bPlacement = b.placementStats[0]?.avg_package || 0;
                return bPlacement - aPlacement;
            });
        } else if (filters.sort === 'fees') {
            results.sort((a, b) => {
                const aFee = a.courseFees[0]?.annual_fee_inr || 999999;
                const bFee = b.courseFees[0]?.annual_fee_inr || 999999;
                return aFee - bFee;
            });
        } else if (filters.sort === 'name') {
            results.sort((a, b) => a.name.localeCompare(b.name));
        }

        const total = results.length;
        const colleges = results.slice(filters.offset, filters.offset + filters.limit);

        return c.json({
            data: colleges,
            pagination: { limit: filters.limit, offset: filters.offset, total },
        });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        return c.json({ error: 'Failed to fetch colleges' }, 500);
    }
});

// POST /api/colleges/compare - Compare multiple colleges
collegeRoutes.post('/compare', async (c) => {
    try {
        const { ids } = await c.req.json();

        if (!Array.isArray(ids) || ids.length < 2) {
            return c.json({ error: 'Provide at least 2 college IDs' }, 400);
        }

        const colleges = await prisma.college.findMany({
            where: { id: { in: ids } },
            include: {
                courseFees: true,
                placementStats: { orderBy: { year: 'desc' }, take: 1 },
                admissionCutoffs: { orderBy: { year: 'desc' }, take: 3 },
            },
        });

        if (colleges.length === 0) {
            return c.json({ error: 'No colleges found' }, 404);
        }

        return c.json({
            colleges,
            comparison: buildComparison(colleges),
        });
    } catch (error) {
        console.error('Error comparing colleges:', error);
        return c.json({ error: 'Failed to compare colleges' }, 500);
    }
});

// GET /api/colleges/compare?ids=1,2,3 - Compare multiple colleges
collegeRoutes.get('/compare', async (c) => {
    try {
        const idsParam = c.req.query('ids') || '';
        const ids = idsParam
            .split(',')
            .map((id) => parseInt(id.trim()))
            .filter((id) => !Number.isNaN(id));

        if (ids.length < 2) {
            return c.json({ error: 'Provide at least 2 college IDs' }, 400);
        }

        const colleges = await prisma.college.findMany({
            where: { id: { in: ids } },
            include: {
                courseFees: true,
                placementStats: { orderBy: { year: 'desc' }, take: 1 },
                admissionCutoffs: { orderBy: { year: 'desc' }, take: 3 },
            },
        });

        if (colleges.length === 0) {
            return c.json({ error: 'No colleges found' }, 404);
        }

        return c.json({
            comparison: buildComparison(colleges),
        });
    } catch (error) {
        console.error('Error comparing colleges:', error);
        return c.json({ error: 'Failed to compare colleges' }, 500);
    }
});

// GET /api/colleges/:id/predictor - Admission probability predictor
collegeRoutes.get('/:id/predictor', async (c) => {
    try {
        const collegeId = parseInt(c.req.param('id'));
        const exam = c.req.query('exam') || 'JEE_MAIN';
        const percentile = parseFloat(c.req.query('percentile') || '0');
        const category = c.req.query('category') || 'GENERAL';

        if (percentile < 0 || percentile > 100) {
            return c.json({ error: 'Invalid percentile' }, 400);
        }

        const cutoffs = await prisma.admissionCutoff.findMany({
            where: {
                college_id: collegeId,
                exam,
                category,
            },
            orderBy: { year: 'desc' },
            take: 3,
        });

        if (cutoffs.length === 0) {
            return c.json(
                { error: 'No cutoff data available' },
                404
            );
        }

        const avgCutoff =
            cutoffs.reduce((sum: number, c: any) => sum + c.cutoff_percentile, 0) /
            cutoffs.length;

        let probability: 'high' | 'medium' | 'low';
        if (percentile > avgCutoff + 3) {
            probability = 'high';
        } else if (percentile > avgCutoff - 5) {
            probability = 'medium';
        } else {
            probability = 'low';
        }

        return c.json({
            probability,
            percentile,
            cutoff_context: {
                exam,
                category,
                avg_cutoff: avgCutoff.toFixed(1),
                last_3_years: cutoffs,
            },
        });
    } catch (error) {
        console.error('Error calculating probability:', error);
        return c.json({ error: 'Failed to calculate probability' }, 500);
    }
});

// GET /api/colleges/:id/career-trends - Career outcome enrichment
collegeRoutes.get('/:id/career-trends', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const college = await prisma.college.findUnique({
            where: { id },
            include: {
                placementStats: {
                    orderBy: { year: 'desc' },
                    take: 1,
                },
            },
        });

        if (!college) {
            return c.json({ error: 'College not found' }, 404);
        }

        return c.json(getCareerTrends(college));
    } catch (error) {
        console.error('Error fetching career trends:', error);
        return c.json({ error: 'Failed to fetch career trends' }, 500);
    }
});

// GET /api/colleges/:id - Get college detail with all relations
collegeRoutes.get('/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const college = await prisma.college.findUnique({
            where: { id },
            include: {
                courseFees: true,
                placementStats: {
                    orderBy: { year: 'desc' },
                },
                admissionCutoffs: {
                    orderBy: { year: 'desc' },
                },
                reviews: {
                    where: { status: 'approved' },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });

        if (!college) {
            return c.json({ error: 'College not found' }, 404);
        }

        // Calculate review aggregates
        const allReviews = await prisma.review.findMany({
            where: { college_id: id, status: 'approved' },
        });

        const reviewAggregates = {
            total: allReviews.length,
            avg_rating: allReviews.length > 0
                ? (allReviews.reduce((sum: number, r: any) => sum + r.rating_overall, 0) / allReviews.length).toFixed(1)
                : null,
            avg_placement_rating: allReviews.length > 0
                ? (allReviews.reduce((sum: number, r: any) => sum + r.rating_placement, 0) / allReviews.length).toFixed(1)
                : null,
        };

        return c.json({
            ...college,
            reviewAggregates,
        });
    } catch (error) {
        console.error('Error fetching college:', error);
        return c.json({ error: 'Failed to fetch college' }, 500);
    }
});
