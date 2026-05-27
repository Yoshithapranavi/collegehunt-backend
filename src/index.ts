import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { collegeRoutes } from './routes/colleges.js';
import { scoreRoutes } from './routes/scoring.js';
import { reviewRoutes } from './routes/reviews.js';
import { adminRoutes } from './routes/admin.js';
import { buildOpenApiSpec } from './lib/openapi.js';

const app = new Hono();
export const prisma = new PrismaClient();

// Root endpoint for browser checks
app.get('/', (c) => {
    return c.json({
        status: 'ok',
        service: 'CollegeHunt backend',
        message: 'Backend is running. Use /health or /api/* endpoints.',
        endpoints: ['/health', '/api/colleges', '/api/score', '/api/reviews', '/api/admin'],
    });
});

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OpenAPI document
app.get('/openapi.json', (c) => c.json(buildOpenApiSpec()));

app.get('/docs', (c) => {
    return c.html(`
                <!doctype html>
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>CollegeHunt API Docs</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.5; }
                            code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
                            a { color: #0b57d0; }
                        </style>
                    </head>
                    <body>
                        <h1>CollegeHunt Backend API</h1>
                        <p>OpenAPI spec: <a href="/openapi.json">/openapi.json</a></p>
                        <ul>
                            <li><code>/colleges</code> and <code>/api/colleges</code></li>
                            <li><code>/score</code> and <code>/api/score</code></li>
                            <li><code>/colleges/:id/reviews</code></li>
                            <li><code>/colleges/:id/predictor</code></li>
                            <li><code>/colleges/:id/career-trends</code></li>
                            <li><code>/admin/*</code> and <code>/api/admin/*</code></li>
                        </ul>
                    </body>
                </html>
        `);
});

// API Routes
app.route('/colleges', collegeRoutes);
app.route('/api/colleges', collegeRoutes);
app.route('/score', scoreRoutes);
app.route('/api/score', scoreRoutes);
app.route('/colleges', reviewRoutes);
app.route('/api/reviews', reviewRoutes);
app.route('/admin', adminRoutes);
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

        // Read body if present
        let body: any;
        if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
            body = await new Promise<string>((resolve, reject) => {
                let data = '';
                req.on('data', (chunk) => data += chunk);
                req.on('end', () => resolve(data));
                req.on('error', reject);
            });
        }

        const request = new Request(url.toString(), {
            method: req.method,
            headers: req.headers as any,
            body: body || undefined,
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
