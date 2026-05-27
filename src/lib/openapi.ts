export function buildOpenApiSpec(baseUrl = 'https://collegehunt-backend-production.up.railway.app') {
    return {
        openapi: '3.0.3',
        info: {
            title: 'CollegeHunt Backend API',
            version: '1.0.0',
            description: 'College discovery, scoring, reviews, shortlist, predictor, and admin APIs.',
        },
        servers: [{ url: baseUrl }],
        paths: {
            '/health': { get: { summary: 'Health check' } },
            '/': { get: { summary: 'Root status' } },
            '/colleges': { get: { summary: 'List colleges with filters' } },
            '/colleges/{id}': { get: { summary: 'College detail' } },
            '/colleges/compare': { get: { summary: 'Compare colleges' } },
            '/colleges/{id}/reviews': { get: { summary: 'List approved reviews', post: { summary: 'Submit review' } } },
            '/colleges/{id}/predictor': { get: { summary: 'Admission probability predictor' } },
            '/colleges/{id}/career-trends': { get: { summary: 'Career outcome enrichment' } },
            '/score': { post: { summary: 'Weighted score ranking' } },
            '/score/shortlist': { post: { summary: 'Save shortlist' } },
            '/score/shortlist/{session_id}': { get: { summary: 'Get shortlist' } },
            '/admin/reviews/{id}/approve': { post: { summary: 'Approve review' } },
            '/admin/reviews/{id}/reject': { post: { summary: 'Reject review' } },
            '/admin/reviews/pending': { get: { summary: 'Pending reviews' } },
            '/admin/stats': { get: { summary: 'Admin statistics' } },
        },
    };
}