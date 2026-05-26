import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { collegeRoutes } from './routes/colleges';
import { scoreRoutes } from './routes/scoring';
import { reviewRoutes } from './routes/reviews';
import { adminRoutes } from './routes/admin';

const app = new Hono();
export const prisma = new PrismaClient();

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.route('/api/colleges', collegeRoutes);
app.route('/api/score', scoreRoutes);
app.route('/api/reviews', reviewRoutes);
app.route('/api/admin', adminRoutes);

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ error: 'Internal server error' }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '3000');
console.log(`🚀 Server starting on http://localhost:${port}`);

export default app;
