import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
];

async function seedColleges() {
    console.log('Starting seed...');
    let createdCount = 0;

    for (const collegeData of collegesData) {
        try {
            const { placementStats = [], reviews = [], ...collegeInput } = collegeData as any;

            const college = await prisma.college.create({
                data: {
                    ...collegeInput,
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
