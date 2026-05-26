import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.admissionCutoff.deleteMany();
    await prisma.placementStat.deleteMany();
    await prisma.courseFee.deleteMany();
    await prisma.college.deleteMany();
    await prisma.shortlist.deleteMany();

    // Seed colleges
    const colleges = await Promise.all([
        prisma.college.create({
            data: {
                name: 'Indian Institute of Technology Delhi',
                city: 'Delhi',
                state: 'Delhi',
                type: 'Government',
                streams: ['Engineering'],
                nirf_rank: 4,
                established_year: 1961,
                accreditation: 'A+',
                website: 'iitd.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 16000 },
                        { course: 'B.Tech Electronics', degree: 'B.Tech', annual_fee_inr: 16000 },
                        { course: 'B.Tech Mechanical', degree: 'B.Tech', annual_fee_inr: 16000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 28.5,
                            max_package: 75.0,
                            placement_pct: 98.5,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'Morgan Stanley'],
                        },
                        {
                            year: 2023,
                            avg_package: 26.0,
                            max_package: 68.0,
                            placement_pct: 97.8,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'JPMorgan', 'Flipkart'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 99.0 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 98.5 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'SC', cutoff_percentile: 95.0 },
                        { exam: 'JEE_MAIN', year: 2023, category: 'GENERAL', cutoff_percentile: 98.9 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Indian Institute of Technology Bombay',
                city: 'Mumbai',
                state: 'Maharashtra',
                type: 'Government',
                streams: ['Engineering'],
                nirf_rank: 3,
                established_year: 1958,
                accreditation: 'A+',
                website: 'iitb.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 16000 },
                        { course: 'B.Tech Electronics', degree: 'B.Tech', annual_fee_inr: 16000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 29.2,
                            max_package: 80.0,
                            placement_pct: 99.1,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'Paytm'],
                        },
                        {
                            year: 2023,
                            avg_package: 27.5,
                            max_package: 75.0,
                            placement_pct: 98.9,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'PhonePe'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 99.3 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 98.8 },
                        { exam: 'JEE_MAIN', year: 2023, category: 'GENERAL', cutoff_percentile: 99.2 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'National Institute of Technology Trichy',
                city: 'Tiruchirappalli',
                state: 'Tamil Nadu',
                type: 'Government',
                streams: ['Engineering'],
                nirf_rank: 14,
                established_year: 1964,
                accreditation: 'A',
                website: 'nitt.edu',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 12500 },
                        { course: 'B.Tech Mechanical', degree: 'B.Tech', annual_fee_inr: 12500 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 12.5,
                            max_package: 42.0,
                            placement_pct: 95.2,
                            top_recruiters: ['Cognizant', 'Infosys', 'TCS', 'Wipro', 'HCL'],
                        },
                        {
                            year: 2023,
                            avg_package: 11.8,
                            max_package: 38.0,
                            placement_pct: 94.5,
                            top_recruiters: ['TCS', 'Cognizant', 'Infosys', 'Accenture', 'Microsoft'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 92.5 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 85.0 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'SC', cutoff_percentile: 75.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Delhi Technological University',
                city: 'Delhi',
                state: 'Delhi',
                type: 'Government',
                streams: ['Engineering'],
                nirf_rank: 34,
                established_year: 1941,
                accreditation: 'A',
                website: 'dtu.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 18000 },
                        { course: 'B.Tech IT', degree: 'B.Tech', annual_fee_inr: 18000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 10.2,
                            max_package: 35.5,
                            placement_pct: 92.0,
                            top_recruiters: ['Infosys', 'TCS', 'Cognizant', 'Capgemini', 'Accenture'],
                        },
                        {
                            year: 2023,
                            avg_package: 9.8,
                            max_package: 33.0,
                            placement_pct: 90.5,
                            top_recruiters: ['TCS', 'Infosys', 'Cognizant', 'IBM', 'Wipro'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 88.0 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 78.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'BITS Pilani',
                city: 'Pilani',
                state: 'Rajasthan',
                type: 'Private',
                streams: ['Engineering'],
                nirf_rank: 17,
                established_year: 1972,
                accreditation: 'A+',
                website: 'bits-pilani.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 280000 },
                        { course: 'B.Tech Electronics', degree: 'B.Tech', annual_fee_inr: 250000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 22.5,
                            max_package: 65.0,
                            placement_pct: 97.5,
                            top_recruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'JP Morgan'],
                        },
                        {
                            year: 2023,
                            avg_package: 20.8,
                            max_package: 60.0,
                            placement_pct: 96.8,
                            top_recruiters: ['Microsoft', 'Google', 'Amazon', 'Adobe', 'Flipkart'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 96.0 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 92.0 },
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 95.5 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Manipal Institute of Technology',
                city: 'Manipal',
                state: 'Karnataka',
                type: 'Private',
                streams: ['Engineering'],
                nirf_rank: 28,
                established_year: 1957,
                accreditation: 'A',
                website: 'manipal.edu',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 225000 },
                        { course: 'B.Tech Mechanical', degree: 'B.Tech', annual_fee_inr: 180000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 16.5,
                            max_package: 50.0,
                            placement_pct: 94.2,
                            top_recruiters: ['Infosys', 'TCS', 'Cognizant', 'Google', 'Amazon'],
                        },
                        {
                            year: 2023,
                            avg_package: 15.2,
                            max_package: 45.0,
                            placement_pct: 93.5,
                            top_recruiters: ['TCS', 'Infosys', 'Cognizant', 'Flipkart', 'Microsoft'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 85.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 78.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'VIT Vellore',
                city: 'Vellore',
                state: 'Tamil Nadu',
                type: 'Private',
                streams: ['Engineering'],
                nirf_rank: 35,
                established_year: 1984,
                accreditation: 'A',
                website: 'vit.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 200000 },
                        { course: 'B.Tech IT', degree: 'B.Tech', annual_fee_inr: 180000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 14.8,
                            max_package: 48.0,
                            placement_pct: 92.5,
                            top_recruiters: ['Infosys', 'Cognizant', 'TCS', 'Accenture', 'Capgemini'],
                        },
                        {
                            year: 2023,
                            avg_package: 13.5,
                            max_package: 42.0,
                            placement_pct: 91.8,
                            top_recruiters: ['TCS', 'Infosys', 'Cognizant', 'IBM', 'Microsoft'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 80.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 72.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Ashoka University',
                city: 'Sonepat',
                state: 'Haryana',
                type: 'Private',
                streams: ['Commerce'],
                nirf_rank: 26,
                established_year: 2014,
                accreditation: 'A',
                website: 'ashoka.edu.in',
                courseFees: {
                    create: [
                        { course: 'B.A Economics', degree: 'B.A', annual_fee_inr: 280000 },
                        { course: 'B.A Politics', degree: 'B.A', annual_fee_inr: 280000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 18.5,
                            max_package: 55.0,
                            placement_pct: 96.5,
                            top_recruiters: ['McKinsey', 'Goldman Sachs', 'JP Morgan', 'Amazon', 'Google'],
                        },
                        {
                            year: 2023,
                            avg_package: 17.2,
                            max_package: 52.0,
                            placement_pct: 95.8,
                            top_recruiters: ['Goldman Sachs', 'McKinsey', 'JPMorgan', 'Bain', 'Amazon'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 92.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 88.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'St. Stephens College Delhi',
                city: 'Delhi',
                state: 'Delhi',
                type: 'Private',
                streams: ['Commerce'],
                nirf_rank: 41,
                established_year: 1881,
                accreditation: 'A',
                website: 'ststephens.edu',
                courseFees: {
                    create: [
                        { course: 'B.Com Economics', degree: 'B.Com', annual_fee_inr: 95000 },
                        { course: 'B.A English', degree: 'B.A', annual_fee_inr: 95000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 14.2,
                            max_package: 38.0,
                            placement_pct: 88.5,
                            top_recruiters: ['Deloitte', 'KPMG', 'EY', 'Microsoft', 'Google'],
                        },
                        {
                            year: 2023,
                            avg_package: 13.0,
                            max_package: 35.0,
                            placement_pct: 87.2,
                            top_recruiters: ['EY', 'Deloitte', 'KPMG', 'Amazon', 'Adobe'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 88.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 82.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Christ University Bangalore',
                city: 'Bangalore',
                state: 'Karnataka',
                type: 'Private',
                streams: ['Commerce', 'Engineering'],
                nirf_rank: 33,
                established_year: 1969,
                accreditation: 'A',
                website: 'christuniversity.in',
                courseFees: {
                    create: [
                        { course: 'B.Com Honors', degree: 'B.Com', annual_fee_inr: 150000 },
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 200000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 15.8,
                            max_package: 52.0,
                            placement_pct: 93.5,
                            top_recruiters: ['Infosys', 'TCS', 'Cognizant', 'Accenture', 'Flipkart'],
                        },
                        {
                            year: 2023,
                            avg_package: 14.5,
                            max_package: 48.0,
                            placement_pct: 92.1,
                            top_recruiters: ['TCS', 'Infosys', 'Cognizant', 'Amazon', 'Microsoft'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 82.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 75.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Miranda House Delhi',
                city: 'Delhi',
                state: 'Delhi',
                type: 'Government',
                streams: ['Commerce'],
                nirf_rank: 43,
                established_year: 1948,
                accreditation: 'A',
                website: 'mirandahouse.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Com Honors', degree: 'B.Com', annual_fee_inr: 32000 },
                        { course: 'B.A Economics', degree: 'B.A', annual_fee_inr: 32000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 12.5,
                            max_package: 35.0,
                            placement_pct: 85.5,
                            top_recruiters: ['Deloitte', 'KPMG', 'EY', 'Google', 'Amazon'],
                        },
                        {
                            year: 2023,
                            avg_package: 11.8,
                            max_package: 32.0,
                            placement_pct: 83.2,
                            top_recruiters: ['EY', 'Deloitte', 'KPMG', 'Microsoft', 'Adobe'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 91.0 },
                        { exam: 'CUET', year: 2024, category: 'OBC', cutoff_percentile: 87.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'National Law University Delhi',
                city: 'Delhi',
                state: 'Delhi',
                type: 'Government',
                streams: ['Law'],
                nirf_rank: 8,
                established_year: 2008,
                accreditation: 'A+',
                website: 'nludelhi.ac.in',
                courseFees: {
                    create: [
                        { course: 'BA LLB 5-Year', degree: 'BA LLB', annual_fee_inr: 50000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 15.5,
                            max_package: 45.0,
                            placement_pct: 94.2,
                            top_recruiters: ['Luthra & Luthra', 'AZB & Partners', 'Shardul Amarchand', 'DSK', 'Cyril Amarchand'],
                        },
                        {
                            year: 2023,
                            avg_package: 14.2,
                            max_package: 42.0,
                            placement_pct: 93.5,
                            top_recruiters: ['AZB & Partners', 'Luthra & Luthra', 'Cyril Amarchand', 'DSK', 'Shardul Amarchand'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CLAT', year: 2024, category: 'GENERAL', cutoff_percentile: 98.5 },
                        { exam: 'CLAT', year: 2024, category: 'OBC', cutoff_percentile: 96.0 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Indian Institute of Technology Madras',
                city: 'Chennai',
                state: 'Tamil Nadu',
                type: 'Government',
                streams: ['Engineering'],
                nirf_rank: 2,
                established_year: 1959,
                accreditation: 'A+',
                website: 'iitm.ac.in',
                courseFees: {
                    create: [
                        { course: 'B.Tech Computer Science', degree: 'B.Tech', annual_fee_inr: 16000 },
                        { course: 'B.Tech Electrical', degree: 'B.Tech', annual_fee_inr: 16000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 27.8,
                            max_package: 78.0,
                            placement_pct: 98.8,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'Stripe'],
                        },
                        {
                            year: 2023,
                            avg_package: 25.5,
                            max_package: 72.0,
                            placement_pct: 98.2,
                            top_recruiters: ['Google', 'Amazon', 'Microsoft', 'JPMorgan', 'Samsung'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'JEE_MAIN', year: 2024, category: 'GENERAL', cutoff_percentile: 99.1 },
                        { exam: 'JEE_MAIN', year: 2024, category: 'OBC', cutoff_percentile: 98.5 },
                    ],
                },
            },
        }),
        prisma.college.create({
            data: {
                name: 'Indian Institute of Management Ahmedabad',
                city: 'Ahmedabad',
                state: 'Gujarat',
                type: 'Government',
                streams: ['Commerce'],
                nirf_rank: 1,
                established_year: 1961,
                accreditation: 'A+',
                website: 'iima.ac.in',
                courseFees: {
                    create: [
                        { course: 'MBA General Management', degree: 'MBA', annual_fee_inr: 800000 },
                    ],
                },
                placementStats: {
                    create: [
                        {
                            year: 2024,
                            avg_package: 24.5,
                            max_package: 65.0,
                            placement_pct: 99.5,
                            top_recruiters: ['McKinsey', 'Goldman Sachs', 'BCG', 'Amazon', 'Google'],
                        },
                        {
                            year: 2023,
                            avg_package: 22.8,
                            max_package: 62.0,
                            placement_pct: 99.2,
                            top_recruiters: ['Goldman Sachs', 'McKinsey', 'BCG', 'JPMorgan', 'Microsoft'],
                        },
                    ],
                },
                admissionCutoffs: {
                    create: [
                        { exam: 'CUET', year: 2024, category: 'GENERAL', cutoff_percentile: 99.5 },
                    ],
                },
            },
        }),
    ]);

    console.log(`✅ Seeded ${colleges.length} colleges`);
    console.log('🎓 Seeded placement stats, course fees, and admission cutoffs');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('✅ Database seed completed successfully!');
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
