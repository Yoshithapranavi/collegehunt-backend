import { Hono } from 'hono';
import { prisma } from '../index.js';

export const adminRoutes = new Hono();

// Middleware to check admin API key
adminRoutes.use('*', async (c, next) => {
    const apiKey = c.req.header('x-admin-key');
    const expectedKey = process.env.ADMIN_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
        return c.json({ error: 'Unauthorized - invalid or missing admin key' }, 401);
    }

    await next();
});

// POST /api/admin/reviews/:id/approve - Approve a review
adminRoutes.post('/reviews/:id/approve', async (c) => {
    try {
        const reviewId = parseInt(c.req.param('id'));

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { status: 'approved' },
        });

        return c.json({
            message: 'Review approved',
            review,
        });
    } catch (error) {
        console.error('Error approving review:', error);
        return c.json({ error: 'Failed to approve review' }, 500);
    }
});

// POST /api/admin/reviews/:id/reject - Reject a review
adminRoutes.post('/reviews/:id/reject', async (c) => {
    try {
        const reviewId = parseInt(c.req.param('id'));
        const { reason } = await c.req.json();

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { status: 'rejected' },
        });

        return c.json({
            message: 'Review rejected',
            reason,
            review,
        });
    } catch (error) {
        console.error('Error rejecting review:', error);
        return c.json({ error: 'Failed to reject review' }, 500);
    }
});

// GET /api/admin/reviews/pending - List pending reviews
adminRoutes.get('/reviews/pending', async (c) => {
    try {
        const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
        const offset = parseInt(c.req.query('offset') || '0');

        const reviews = await prisma.review.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'asc' },
            skip: offset,
            take: limit,
            include: {
                college: {
                    select: { id: true, name: true },
                },
            },
        });

        const total = await prisma.review.count({
            where: { status: 'pending' },
        });

        return c.json({
            reviews,
            pagination: {
                limit,
                offset,
                total,
            },
        });
    } catch (error) {
        console.error('Error fetching pending reviews:', error);
        return c.json({ error: 'Failed to fetch reviews' }, 500);
    }
});

// GET /api/admin/stats - Get admin statistics
adminRoutes.get('/stats', async (c) => {
    try {
        const totalColleges = await prisma.college.count();
        const totalReviews = await prisma.review.count();
        const pendingReviews = await prisma.review.count({
            where: { status: 'pending' },
        });
        const approvedReviews = await prisma.review.count({
            where: { status: 'approved' },
        });

        return c.json({
            colleges: totalColleges,
            reviews: {
                total: totalReviews,
                pending: pendingReviews,
                approved: approvedReviews,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return c.json({ error: 'Failed to fetch stats' }, 500);
    }
});
