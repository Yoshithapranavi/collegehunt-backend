/**
 * College Scoring Logic
 * Normalizes metrics and applies weighted scoring
 */

interface College {
    id: number;
    name: string;
    city: string;
    courseFees: { annual_fee_inr: number }[];
    placementStats: { avg_package: number; year: number }[];
    nirf_rank: number | null;
}

interface Weights {
    placement: number;
    fees: number;
    location: number;
}

interface ScoreResult {
    overall_score: number;
    dimension_scores: {
        placement_score: number;
        fees_score: number;
        location_score: number;
    };
}

/**
 * Calculate normalized placement score (0-100)
 * Higher avg package = higher score
 */
function getPlacementScore(college: College): number {
    const latestPlacement = college.placementStats[0];
    if (!latestPlacement) return 50;

    // Normalize: assume avg_package ranges from 4 to 40 lakh
    const avgPkg = latestPlacement.avg_package;
    const score = Math.min(100, (avgPkg / 40) * 100);
    return Math.max(0, score);
}

/**
 * Calculate normalized fees score (0-100)
 * Lower fees = higher score (inverted)
 */
function getFeesScore(college: College): number {
    if (college.courseFees.length === 0) return 50;

    const minFee = Math.min(...college.courseFees.map((f) => f.annual_fee_inr));

    // Normalize: assume fees range from 10,000 to 5,00,000
    // Lower fees should score higher
    const maxFee = 500000;
    const minFeeExpected = 10000;

    const feesInRange = Math.max(minFeeExpected, Math.min(maxFee, minFee));
    const invertedScore = ((maxFee - feesInRange) / (maxFee - minFeeExpected)) * 100;

    return Math.max(0, Math.min(100, invertedScore));
}

/**
 * Calculate location score based on tier
 * Tier 1 cities (Delhi, Mumbai, Bangalore, Hyderabad) = 80-100
 * Tier 2 cities = 60-80
 * Others = 40-60
 */
function getLocationScore(city: string): number {
    const tier1Cities = [
        'delhi',
        'mumbai',
        'bangalore',
        'hyderabad',
        'pune',
        'chenai',
    ];
    const tier2Cities = [
        'ahmedabad',
        'jaipur',
        'kolkata',
        'lucknow',
        'chandigarh',
        'cochin',
    ];

    const lowerCity = city.toLowerCase();
    if (tier1Cities.includes(lowerCity)) return 85;
    if (tier2Cities.includes(lowerCity)) return 70;
    return 55;
}

/**
 * Main scoring function
 * Returns overall score and individual dimension scores
 */
export function calculateScore(college: College, weights: Weights): ScoreResult {
    const placement_score = getPlacementScore(college);
    const fees_score = getFeesScore(college);
    const location_score = getLocationScore(college.city);

    const overall_score =
        placement_score * weights.placement +
        fees_score * weights.fees +
        location_score * weights.location;

    return {
        overall_score: Math.round(overall_score * 10) / 10,
        dimension_scores: {
            placement_score: Math.round(placement_score * 10) / 10,
            fees_score: Math.round(fees_score * 10) / 10,
            location_score: Math.round(location_score * 10) / 10,
        },
    };
}

/**
 * Test cases for scoring function
 */
export function runScoringTests(): void {
    console.log('🧪 Running scoring tests...');

    // Test 1: Equal weights (1/3 each)
    const testCollege1: College = {
        id: 1,
        name: 'Test College 1',
        city: 'Delhi',
        courseFees: [{ annual_fee_inr: 100000 }],
        placementStats: [{ avg_package: 15, year: 2024 }],
        nirf_rank: 10,
    };

    const weights1 = { placement: 1, fees: 1, location: 1 };
    const result1 = calculateScore(testCollege1, weights1);
    console.log('✅ Test 1 (Equal weights):', result1);
    if (result1.overall_score > 0 && result1.overall_score <= 100) {
        console.log('   PASS');
    } else {
        console.log('   FAIL: Score out of range');
    }

    // Test 2: Single weight 100%
    const weights2 = { placement: 1, fees: 0, location: 0 };
    const result2 = calculateScore(testCollege1, weights2);
    console.log('✅ Test 2 (100% Placement):', result2);
    if (result2.overall_score === result2.dimension_scores.placement_score) {
        console.log('   PASS');
    } else {
        console.log('   FAIL: Should equal placement score');
    }

    // Test 3: Extreme fee range
    const testCollege2: College = {
        id: 2,
        name: 'Expensive College',
        city: 'Mumbai',
        courseFees: [{ annual_fee_inr: 500000 }],
        placementStats: [{ avg_package: 25, year: 2024 }],
        nirf_rank: 5,
    };

    const weights3 = { placement: 0.33, fees: 0.33, location: 0.34 };
    const result3 = calculateScore(testCollege2, weights3);
    console.log('✅ Test 3 (Extreme fees):', result3);
    if (result3.dimension_scores.fees_score < 30) {
        console.log('   PASS: High fees resulted in low score');
    } else {
        console.log('   FAIL: High fees should score lower');
    }

    console.log('✅ All tests completed');
}
