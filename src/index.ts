import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
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

// Graceful shutdown
const handleShutdown = async (signal: string) => {
    console.log(`\n${signal} received, closing connections...`);
    await prisma.$disconnect();
    process.exit(0);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Start HTTP Server
const port = parseInt(process.env.PORT || '3000');

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const request = new Request(url.toString(), {
            method: req.method,
            headers: req.headers as any,
            body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req,
        });

        const response = await app.fetch(request);

        res.writeHead(response.status, Object.fromEntries(response.headers as any));
        res.end(await response.text());
    } catch (error) {
        console.error('Request error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
});

export default app;
