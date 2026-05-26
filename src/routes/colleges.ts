import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index';

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

// Helper function to get colleges with filters
async function getCollegesWithFilters(filters: FilterInput) {
    const where: any = {};

    if (filters.stream) {
        where.streams = { has: filters.stream };
    }
    if (filters.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters.type) {
        where.type = { contains: filters.type, mode: 'insensitive' };
    }

    let orderBy: any = { nirf_rank: 'asc' };
    if (filters.sort === 'placement') {
        orderBy = { placementStats: { _count: 'desc' } };
    } else if (filters.sort === 'fees') {
        orderBy = { courseFees: { _min: { annual_fee_inr: 'asc' } } };
    } else if (filters.sort === 'name') {
        orderBy = { name: 'asc' };
    }

    const colleges = await prisma.college.findMany({
        where,
        orderBy,
        skip: filters.offset,
        take: filters.limit,
        include: {
            courseFees: true,
            placementStats: {
                orderBy: { year: 'desc' },
                take: 1,
            },
        },
    });

    return colleges;
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

        // Search by name or city if q parameter provided
        let colleges = await getCollegesWithFilters(filters);

        if (query.q) {
            const searchTerm = query.q.toLowerCase();
            colleges = colleges.filter(
                (college: any) =>
                    college.name.toLowerCase().includes(searchTerm) ||
                    college.city.toLowerCase().includes(searchTerm)
            );
        }

        // Apply fees filter if provided
        if (filters.fees_max) {
            colleges = colleges.filter((college: any) => {
                const minFee = college.courseFees[0]?.annual_fee_inr || 0;
                return minFee <= (filters.fees_max || 0);
            });
        }

        const total = await prisma.college.count({ where: {} });

        return c.json({
            data: colleges,
            pagination: {
                limit: filters.limit,
                offset: filters.offset,
                total,
            },
        });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        return c.json({ error: 'Failed to fetch colleges' }, 500);
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
            comparison: {
                count: colleges.length,
                dimensions: ['fees', 'placement', 'rank', 'location'],
            },
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
