import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';

export const reviewRoutes = new Hono();

const ReviewSchema = z.object({
    author_name: z.string().min(2).max(100),
    batch_year: z.number().min(2000).max(new Date().getFullYear()),
    stream: z.string().min(2),
    rating_overall: z.number().min(1).max(5),
    rating_placement: z.number().min(1).max(5),
    rating_faculty: z.number().min(1).max(5),
    rating_infra: z.number().min(1).max(5),
    body: z.string().min(80).max(2000),
});

type ReviewInput = z.infer<typeof ReviewSchema>;

// POST /api/reviews/:college_id/create - Submit a review
reviewRoutes.post('/:college_id/create', async (c) => {
    try {
        const collegeId = parseInt(c.req.param('college_id'));
        const body = await c.req.json();
        const reviewData = ReviewSchema.parse(body);

        // Check if college exists
        const college = await prisma.college.findUnique({
            where: { id: collegeId },
        });

        if (!college) {
            return c.json({ error: 'College not found' }, 404);
        }

        const review = await prisma.review.create({
            data: {
                college_id: collegeId,
                ...reviewData,
                status: 'pending',
            },
        });

        return c.json({
            message: 'Review submitted for moderation',
            review,
        }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce(
                (acc, err) => ({
                    ...acc,
                    [err.path[0]]: err.message,
                }),
                {}
            );
            return c.json({ error: 'Validation failed', fieldErrors }, 400);
        }
        console.error('Error creating review:', error);
        return c.json({ error: 'Failed to create review' }, 500);
    }
});

// GET /api/reviews/:college_id - Get approved reviews with pagination
reviewRoutes.get('/:college_id', async (c) => {
    try {
        const collegeId = parseInt(c.req.param('college_id'));
        const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
        const offset = parseInt(c.req.query('offset') || '0');

        const college = await prisma.college.findUnique({
            where: { id: collegeId },
        });

        if (!college) {
            return c.json({ error: 'College not found' }, 404);
        }

        const reviews = await prisma.review.findMany({
            where: {
                college_id: collegeId,
                status: 'approved',
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        const total = await prisma.review.count({
            where: {
                college_id: collegeId,
                status: 'approved',
            },
        });

        // Calculate aggregates
        const aggregates = {
            total_reviews: total,
            avg_overall: 0,
            avg_placement: 0,
            avg_faculty: 0,
            avg_infra: 0,
        };

        if (total > 0) {
            const stats = await prisma.review.aggregate({
                where: {
                    college_id: collegeId,
                    status: 'approved',
                },
                _avg: {
                    rating_overall: true,
                    rating_placement: true,
                    rating_faculty: true,
                    rating_infra: true,
                },
            });

            aggregates.avg_overall = Math.round((stats._avg.rating_overall || 0) * 10) / 10;
            aggregates.avg_placement = Math.round((stats._avg.rating_placement || 0) * 10) / 10;
            aggregates.avg_faculty = Math.round((stats._avg.rating_faculty || 0) * 10) / 10;
            aggregates.avg_infra = Math.round((stats._avg.rating_infra || 0) * 10) / 10;
        }

        return c.json({
            college_id: collegeId,
            reviews,
            aggregates,
            pagination: {
                limit,
                offset,
                total,
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return c.json({ error: 'Failed to fetch reviews' }, 500);
    }
});
