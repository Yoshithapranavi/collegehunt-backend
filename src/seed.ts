import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseStreams(streams: string) {
    try {
        return JSON.parse(streams || '[]');
    } catch {
        return [];
    }
}

function getPrimaryStream(collegeData: any) {
    const streams = parseStreams(collegeData.streams);
    return streams[0] || 'Engineering';
}

function buildCourseFees(collegeData: any) {
    const primaryStream = getPrimaryStream(collegeData);
    const government = collegeData.type === 'Government';
    const baseFee = government ? 18000 : 125000;

    if (primaryStream === 'Engineering') {
        return [
            { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: baseFee },
            { course: 'B.Tech Electronics', degree: 'B.Tech', annual_fee_inr: Math.round(baseFee * 1.1) },
        ];
    }

    if (primaryStream === 'Commerce') {
        return [
            { course: 'B.Com Honours', degree: 'B.Com', annual_fee_inr: Math.round(baseFee * 0.8) },
            { course: 'BBA', degree: 'BBA', annual_fee_inr: Math.round(baseFee * 1.05) },
        ];
    }

    if (primaryStream === 'Law') {
        return [
            { course: 'BA LLB', degree: 'LLB', annual_fee_inr: Math.round(baseFee * 0.9) },
        ];
    }

    if (primaryStream === 'Management') {
        return [
            { course: 'MBA', degree: 'MBA', annual_fee_inr: Math.round(baseFee * 1.6) },
            { course: 'PGDM', degree: 'PGDM', annual_fee_inr: Math.round(baseFee * 1.7) },
        ];
    }

    return [
        { course: 'General Programme', degree: 'UG', annual_fee_inr: baseFee },
        { course: 'Honours Programme', degree: 'UG', annual_fee_inr: Math.round(baseFee * 1.15) },
    ];
}

function buildAdmissionCutoffs(collegeData: any) {
    const primaryStream = getPrimaryStream(collegeData);
    const exam = primaryStream === 'Law' ? 'CLAT' : primaryStream === 'Commerce' || primaryStream === 'Management' || primaryStream === 'Science' ? 'CUET' : 'JEE_MAIN';
    const base = collegeData.type === 'Government' ? 96 : 89;
    const rankBonus = collegeData.nirf_rank ? Math.max(0, 10 - Math.floor(collegeData.nirf_rank / 10)) : 0;
    const baseCutoff = Math.min(99.5, base + rankBonus);
    const categories = [
        { category: 'GENERAL', delta: 0 },
        { category: 'OBC', delta: -2.5 },
        { category: 'SC', delta: -5 },
        { category: 'ST', delta: -7 },
    ];

    return [2024, 2023, 2022].flatMap((year, index) =>
        categories.map(({ category, delta }) => ({
            exam,
            year,
            category,
            cutoff_percentile: Math.max(55, Math.min(99.8, Number((baseCutoff - index * 0.7 + delta).toFixed(1)))),
        }))
    );
}

const collegesData = [
    {
        name: 'Indian Institute of Technology Delhi',
        city: 'Delhi',
        state: 'Delhi',
        type: 'Government',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 4,
        established_year: 1961,
        accreditation: 'A+',
        website: 'iitd.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 25.5,
                max_package: 85.0,
                placement_pct: 98.5,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'Goldman Sachs', 'Amazon']),
            },
            {
                year: 2023,
                avg_package: 23.0,
                max_package: 80.0,
                placement_pct: 97.8,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'Morgan Stanley']),
            },
        ],
        reviews: [
            {
                author_name: 'Raj Kumar',
                batch_year: 2022,
                stream: 'Engineering',
                rating_overall: 5,
                rating_placement: 5,
                rating_faculty: 4,
                rating_infra: 5,
                body: 'IIT Delhi is an excellent institution with top-notch faculty and amazing placement opportunities. The campus is well-equipped with modern facilities.',
                status: 'approved',
            },
            {
                author_name: 'Priya Sharma',
                batch_year: 2021,
                stream: 'Engineering',
                rating_overall: 5,
                rating_placement: 5,
                rating_faculty: 5,
                rating_infra: 4,
                body: 'Great experience at IIT Delhi. The academic curriculum is rigorous and the faculty are knowledgeable. Placements are excellent.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Indian Institute of Technology Bombay',
        city: 'Mumbai',
        state: 'Maharashtra',
        type: 'Government',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 3,
        established_year: 1958,
        accreditation: 'A+',
        website: 'iitb.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 26.0,
                max_package: 88.0,
                placement_pct: 99.0,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'McKinsey', 'Flipkart']),
            },
            {
                year: 2023,
                avg_package: 24.5,
                max_package: 82.0,
                placement_pct: 98.5,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'Amazon']),
            },
        ],
        reviews: [
            {
                author_name: 'Aditya Patel',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 5,
                rating_placement: 5,
                rating_faculty: 5,
                rating_infra: 5,
                body: 'IIT Bombay is world-class. The placements are incredible and the faculty are industry experts. Highly recommended.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Indian Institute of Technology Madras',
        city: 'Chennai',
        state: 'Tamil Nadu',
        type: 'Government',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 2,
        established_year: 1959,
        accreditation: 'A+',
        website: 'iitm.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 24.0,
                max_package: 84.0,
                placement_pct: 98.0,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'TCS', 'Infosys']),
            },
        ],
        reviews: [
            {
                author_name: 'Neha Gupta',
                batch_year: 2022,
                stream: 'Engineering',
                rating_overall: 4,
                rating_placement: 5,
                rating_faculty: 4,
                rating_infra: 4,
                body: 'Good institution with strong placements. Faculty are experienced and campus is nice.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'National Institute of Technology Trichy',
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        type: 'Government',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 14,
        established_year: 1964,
        accreditation: 'A',
        website: 'nitt.edu',
        placementStats: [
            {
                year: 2024,
                avg_package: 12.0,
                max_package: 45.0,
                placement_pct: 95.5,
                top_recruiters: JSON.stringify(['Cognizant', 'TCS', 'Infosys', 'HCL']),
            },
        ],
        reviews: [
            {
                author_name: 'Arjun Verma',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 4,
                rating_placement: 4,
                rating_faculty: 4,
                rating_infra: 3,
                body: 'NIT Trichy is a solid institution for engineering. Good placements and decent campus facilities.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'BITS Pilani',
        city: 'Pilani',
        state: 'Rajasthan',
        type: 'Private',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 17,
        established_year: 1972,
        accreditation: 'A+',
        website: 'bits-pilani.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 18.0,
                max_package: 65.0,
                placement_pct: 96.0,
                top_recruiters: JSON.stringify(['Google', 'Microsoft', 'Amazon', 'Adobe']),
            },
        ],
        reviews: [
            {
                author_name: 'Isha Patel',
                batch_year: 2022,
                stream: 'Engineering',
                rating_overall: 4,
                rating_placement: 4,
                rating_faculty: 5,
                rating_infra: 4,
                body: 'BITS Pilani has excellent teaching and research opportunities. Placements are good and campus life is vibrant.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Delhi Technological University',
        city: 'Delhi',
        state: 'Delhi',
        type: 'Government',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 34,
        established_year: 1941,
        accreditation: 'A',
        website: 'dtu.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 9.5,
                max_package: 38.0,
                placement_pct: 92.0,
                top_recruiters: JSON.stringify(['TCS', 'Infosys', 'Wipro', 'Cognizant']),
            },
        ],
        reviews: [
            {
                author_name: 'Kunal Singh',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 3,
                rating_placement: 3,
                rating_faculty: 4,
                rating_infra: 3,
                body: 'DTU is an average institution. Placements are okay but not great. Faculty varies in quality.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Ashoka University',
        city: 'Sonepat',
        state: 'Haryana',
        type: 'Private',
        streams: JSON.stringify(['Commerce', 'Science']),
        nirf_rank: 26,
        established_year: 2014,
        accreditation: 'A',
        website: 'ashoka.edu.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 14.0,
                max_package: 55.0,
                placement_pct: 94.0,
                top_recruiters: JSON.stringify(['McKinsey', 'Goldman Sachs', 'Deloitte', 'EY']),
            },
        ],
        reviews: [
            {
                author_name: 'Anjali Desai',
                batch_year: 2023,
                stream: 'Commerce',
                rating_overall: 4,
                rating_placement: 4,
                rating_faculty: 5,
                rating_infra: 5,
                body: 'Ashoka is a wonderful liberal arts college with excellent faculty and infrastructure. Placements are good.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'St. Stephens College Delhi',
        city: 'Delhi',
        state: 'Delhi',
        type: 'Private',
        streams: JSON.stringify(['Commerce', 'Humanities']),
        nirf_rank: 41,
        established_year: 1881,
        accreditation: 'A',
        website: 'ststephens.edu',
        placementStats: [
            {
                year: 2024,
                avg_package: 8.5,
                max_package: 32.0,
                placement_pct: 88.0,
                top_recruiters: JSON.stringify(['HDFC Bank', 'ICICI Bank', 'Accenture', 'Capgemini']),
            },
        ],
        reviews: [
            {
                author_name: 'Vikram Nair',
                batch_year: 2022,
                stream: 'Commerce',
                rating_overall: 4,
                rating_placement: 3,
                rating_faculty: 5,
                rating_infra: 4,
                body: 'St. Stephens has a rich heritage and experienced faculty. Good college experience though placements could be better.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Manipal Institute of Technology',
        city: 'Manipal',
        state: 'Karnataka',
        type: 'Private',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 28,
        established_year: 1957,
        accreditation: 'A',
        website: 'manipal.edu',
        placementStats: [
            {
                year: 2024,
                avg_package: 11.0,
                max_package: 42.0,
                placement_pct: 91.0,
                top_recruiters: JSON.stringify(['TCS', 'Infosys', 'Wipro', 'Mindtree']),
            },
        ],
        reviews: [
            {
                author_name: 'Siddhant Chatterjee',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 4,
                rating_placement: 4,
                rating_faculty: 4,
                rating_infra: 4,
                body: 'MIT is a good engineering college with decent placements. Campus life is active and vibrant.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'VIT Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        type: 'Private',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 35,
        established_year: 1984,
        accreditation: 'A',
        website: 'vit.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 10.5,
                max_package: 40.0,
                placement_pct: 90.0,
                top_recruiters: JSON.stringify(['TCS', 'Infosys', 'Cognizant', 'Capgemini']),
            },
        ],
        reviews: [
            {
                author_name: 'Meera Agarwal',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 3,
                rating_placement: 3,
                rating_faculty: 4,
                rating_infra: 5,
                body: 'VIT has good infrastructure but placements are average. Need to put effort for good companies.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Lovely Professional University',
        city: 'Jalandhar',
        state: 'Punjab',
        type: 'Private',
        streams: JSON.stringify(['Engineering']),
        nirf_rank: 50,
        established_year: 2005,
        accreditation: 'A',
        website: 'lpu.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 7.5,
                max_package: 28.0,
                placement_pct: 85.0,
                top_recruiters: JSON.stringify(['Accenture', 'TCS', 'Wipro', 'Tech Mahindra']),
            },
        ],
        reviews: [
            {
                author_name: 'Harpreet Singh',
                batch_year: 2022,
                stream: 'Engineering',
                rating_overall: 3,
                rating_placement: 3,
                rating_faculty: 3,
                rating_infra: 4,
                body: 'LPU is okay for engineering studies. Placements are average. Good infrastructure but academics could be more rigorous.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Christ University',
        city: 'Bangalore',
        state: 'Karnataka',
        type: 'Private',
        streams: JSON.stringify(['Engineering', 'Commerce']),
        nirf_rank: 33,
        established_year: 1969,
        accreditation: 'A',
        website: 'christuniversity.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 12.5,
                max_package: 48.0,
                placement_pct: 93.0,
                top_recruiters: JSON.stringify(['Google', 'Amazon', 'Flipkart', 'Accenture']),
            },
        ],
        reviews: [
            {
                author_name: 'Sophia D\'Souza',
                batch_year: 2023,
                stream: 'Engineering',
                rating_overall: 4,
                rating_placement: 4,
                rating_faculty: 5,
                rating_infra: 5,
                body: 'Christ University is excellent with great faculty and infrastructure. Placements are good and well-supportive environment.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'National Law University Delhi',
        city: 'Delhi',
        state: 'Delhi',
        type: 'Government',
        streams: JSON.stringify(['Law']),
        nirf_rank: 8,
        established_year: 2008,
        accreditation: 'A+',
        website: 'nludelhi.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 15.0,
                max_package: 58.0,
                placement_pct: 96.0,
                top_recruiters: JSON.stringify(['Law Firms', 'Corporate', 'Government']),
            },
        ],
        reviews: [
            {
                author_name: 'Rahul Verma',
                batch_year: 2023,
                stream: 'Law',
                rating_overall: 5,
                rating_placement: 5,
                rating_faculty: 5,
                rating_infra: 4,
                body: 'NLU Delhi is the best law school in India. Excellent faculty, great placements, and strong industry connections.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Indian Institute of Management Ahmedabad',
        city: 'Ahmedabad',
        state: 'Gujarat',
        type: 'Government',
        streams: JSON.stringify(['Management']),
        nirf_rank: 1,
        established_year: 1961,
        accreditation: 'A++',
        website: 'iima.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 34.5,
                max_package: 115.0,
                placement_pct: 100.0,
                top_recruiters: JSON.stringify(['McKinsey', 'Bain', 'Goldman Sachs', 'Amazon']),
            },
        ],
        reviews: [
            {
                author_name: 'Aman Shah',
                batch_year: 2022,
                stream: 'Management',
                rating_overall: 5,
                rating_placement: 5,
                rating_faculty: 5,
                rating_infra: 5,
                body: 'IIMA offers world-class management education with elite placements, case studies, and unmatched peer learning.',
                status: 'approved',
            },
        ],
    },
    {
        name: 'Miranda House',
        city: 'Delhi',
        state: 'Delhi',
        type: 'Government',
        streams: JSON.stringify(['Commerce', 'Science']),
        nirf_rank: 10,
        established_year: 1948,
        accreditation: 'A++',
        website: 'mirandahouse.ac.in',
        placementStats: [
            {
                year: 2024,
                avg_package: 8.0,
                max_package: 25.0,
                placement_pct: 90.0,
                top_recruiters: JSON.stringify(['Deloitte', 'Accenture', 'HDFC Bank']),
            },
        ],
        reviews: [
            {
                author_name: 'Nisha Verma',
                batch_year: 2023,
                stream: 'Commerce',
                rating_overall: 5,
                rating_placement: 4,
                rating_faculty: 5,
                rating_infra: 4,
                body: 'Miranda House has a strong academic culture, experienced faculty, and excellent opportunities in Delhi University.',
                status: 'approved',
            },
        ],
    },
];

async function seedColleges() {
    console.log('Starting seed...');
    console.log('Clearing existing data...');

    await prisma.shortlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.placementStat.deleteMany();
    await prisma.courseFee.deleteMany();
    await prisma.admissionCutoff.deleteMany();
    await prisma.college.deleteMany();

    let createdCount = 0;

    for (const collegeData of collegesData) {
        try {
            const { placementStats = [], reviews = [], ...collegeInput } = collegeData as any;

            const college = await prisma.college.create({
                data: {
                    ...collegeInput,
                    courseFees: {
                        create: buildCourseFees(collegeData),
                    },
                    admissionCutoffs: {
                        create: buildAdmissionCutoffs(collegeData),
                    },
                    placementStats: {
                        create: placementStats,
                    },
                    reviews: {
                        create: reviews,
                    },
                },
                include: {
                    placementStats: true,
                    reviews: true,
                },
            });

            console.log(`✓ Created ${college.name} (ID: ${college.id})`);
            createdCount++;
        } catch (error: any) {
            console.error(`✗ Failed to create ${collegeData.name}:`, error.message);
        }
    }

    console.log(`\n✓ Seeding complete! Created ${createdCount}/${collegesData.length} colleges`);
}

seedColleges()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
