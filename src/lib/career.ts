type PlacementStat = {
    year: number;
    avg_package: number;
    max_package: number;
    placement_pct: number;
    top_recruiters: string;
};

type CollegeLike = {
    id: number;
    name: string;
    city: string;
    placementStats: PlacementStat[];
};

type CareerInsight = {
    recruiter: string;
    industry: string;
    role_cluster: string;
    salary_band_in_lpa: [number, number];
    growth_tag: 'High Growth' | 'Stable' | 'Declining';
};

const recruiterMap: Record<string, CareerInsight> = {
    Google: { recruiter: 'Google', industry: 'Technology', role_cluster: 'Software & Product', salary_band_in_lpa: [18, 45], growth_tag: 'High Growth' },
    Microsoft: { recruiter: 'Microsoft', industry: 'Technology', role_cluster: 'Software & Cloud', salary_band_in_lpa: [16, 40], growth_tag: 'High Growth' },
    Amazon: { recruiter: 'Amazon', industry: 'E-commerce / Technology', role_cluster: 'Software & Operations', salary_band_in_lpa: [14, 35], growth_tag: 'High Growth' },
    Flipkart: { recruiter: 'Flipkart', industry: 'E-commerce / Technology', role_cluster: 'Product & Analytics', salary_band_in_lpa: [12, 28], growth_tag: 'High Growth' },
    GoldmanSachs: { recruiter: 'Goldman Sachs', industry: 'BFSI', role_cluster: 'Investment Banking & Analytics', salary_band_in_lpa: [16, 32], growth_tag: 'Stable' },
    'Goldman Sachs': { recruiter: 'Goldman Sachs', industry: 'BFSI', role_cluster: 'Investment Banking & Analytics', salary_band_in_lpa: [16, 32], growth_tag: 'Stable' },
    McKinsey: { recruiter: 'McKinsey', industry: 'Consulting', role_cluster: 'Strategy Consulting', salary_band_in_lpa: [18, 35], growth_tag: 'High Growth' },
    Deloitte: { recruiter: 'Deloitte', industry: 'Consulting', role_cluster: 'Business Consulting', salary_band_in_lpa: [8, 18], growth_tag: 'Stable' },
    EY: { recruiter: 'EY', industry: 'Consulting / Audit', role_cluster: 'Audit & Advisory', salary_band_in_lpa: [8, 16], growth_tag: 'Stable' },
    Accenture: { recruiter: 'Accenture', industry: 'IT Services', role_cluster: 'Engineering & Consulting', salary_band_in_lpa: [6, 14], growth_tag: 'Stable' },
    TCS: { recruiter: 'TCS', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [4, 10], growth_tag: 'Stable' },
    Infosys: { recruiter: 'Infosys', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [4, 10], growth_tag: 'Stable' },
    Wipro: { recruiter: 'Wipro', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [4, 9], growth_tag: 'Stable' },
    HCL: { recruiter: 'HCL', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [4, 9], growth_tag: 'Stable' },
    HDFC: { recruiter: 'HDFC Bank', industry: 'BFSI', role_cluster: 'Banking & Finance', salary_band_in_lpa: [6, 12], growth_tag: 'Stable' },
    'HDFC Bank': { recruiter: 'HDFC Bank', industry: 'BFSI', role_cluster: 'Banking & Finance', salary_band_in_lpa: [6, 12], growth_tag: 'Stable' },
    'ICICI Bank': { recruiter: 'ICICI Bank', industry: 'BFSI', role_cluster: 'Banking & Finance', salary_band_in_lpa: [6, 12], growth_tag: 'Stable' },
    Mindtree: { recruiter: 'Mindtree', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [6, 13], growth_tag: 'Stable' },
    Capgemini: { recruiter: 'Capgemini', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [5, 11], growth_tag: 'Stable' },
    TechMahindra: { recruiter: 'Tech Mahindra', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [5, 11], growth_tag: 'Stable' },
    'Tech Mahindra': { recruiter: 'Tech Mahindra', industry: 'IT Services', role_cluster: 'Engineering Services', salary_band_in_lpa: [5, 11], growth_tag: 'Stable' },
    Adobe: { recruiter: 'Adobe', industry: 'Technology', role_cluster: 'Product & Design', salary_band_in_lpa: [20, 45], growth_tag: 'High Growth' },
    'Law Firms': { recruiter: 'Law Firms', industry: 'Legal Services', role_cluster: 'Litigation & Corporate Law', salary_band_in_lpa: [8, 30], growth_tag: 'Stable' },
    Corporate: { recruiter: 'Corporate', industry: 'Mixed Industry', role_cluster: 'In-house Counsel / Management', salary_band_in_lpa: [8, 24], growth_tag: 'Stable' },
    Government: { recruiter: 'Government', industry: 'Public Sector', role_cluster: 'Policy & Civil Services', salary_band_in_lpa: [6, 18], growth_tag: 'Stable' },
};

function normalizeRecruiterName(name: string) {
    return name.trim().replace(/\s+/g, ' ');
}

export function getCareerTrends(college: CollegeLike) {
    const latest = college.placementStats[0];
    const recruiters = latest ? JSON.parse(latest.top_recruiters || '[]') : [];

    const recruiterInsights = recruiters.map((recruiter: string) => {
        const normalized = normalizeRecruiterName(recruiter);
        return recruiterMap[normalized] || {
            recruiter: normalized,
            industry: 'General',
            role_cluster: 'Core Roles',
            salary_band_in_lpa: [6, 14],
            growth_tag: 'Stable' as const,
        };
    });

    const roleClusters: Record<string, { industry: string; recruiters: string[]; avg_salary_band_in_lpa: [number, number]; growth_tag: string }> = recruiterInsights.reduce((acc, insight) => {
        const existing = acc[insight.role_cluster];
        if (!existing) {
            acc[insight.role_cluster] = {
                industry: insight.industry,
                recruiters: [insight.recruiter],
                avg_salary_band_in_lpa: insight.salary_band_in_lpa,
                growth_tag: insight.growth_tag,
            };
            return acc;
        }

        existing.recruiters.push(insight.recruiter);
        existing.avg_salary_band_in_lpa = [
            Math.round((existing.avg_salary_band_in_lpa[0] + insight.salary_band_in_lpa[0]) / 2),
            Math.round((existing.avg_salary_band_in_lpa[1] + insight.salary_band_in_lpa[1]) / 2),
        ];
        if (insight.growth_tag === 'High Growth') existing.growth_tag = 'High Growth';
        return acc;
    }, {});

    return {
        college: {
            id: college.id,
            name: college.name,
            city: college.city,
        },
        latest_placement_year: latest?.year || null,
        recruiter_insights: recruiterInsights,
        role_clusters: roleClusters,
    };
}