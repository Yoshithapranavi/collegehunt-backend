import { describe, it, expect } from 'vitest';
import { calculateScore } from '../lib/scoring.js';

describe('Scoring Engine', () => {
    const mockCollege = {
        id: 1,
        name: 'Test College',
        city: 'Delhi',
        courseFees: [{ annual_fee_inr: 100000 }],
        placementStats: [{ avg_package: 15, year: 2024 }],
        nirf_rank: 10,
    };

    // Test 1: Equal weights (each 33.3%)
    it('should calculate score correctly with equal weights', () => {
        const weights = { placement: 0.33, fees: 0.33, location: 0.34 };
        const result = calculateScore(mockCollege, weights);

        expect(result.overall_score).toBeGreaterThan(0);
        expect(result.overall_score).toBeLessThanOrEqual(100);
        expect(result.dimension_scores.placement_score).toBeGreaterThan(0);
        expect(result.dimension_scores.fees_score).toBeGreaterThan(0);
        expect(result.dimension_scores.location_score).toBeGreaterThan(0);
    });

    // Test 2: Single weight 100% (placement only)
    it('should return placement score when weight is 100%', () => {
        const weights = { placement: 1, fees: 0, location: 0 };
        const result = calculateScore(mockCollege, weights);

        expect(result.overall_score).toBe(result.dimension_scores.placement_score);
    });

    // Test 3: Extreme fee range (very expensive college)
    it('should penalize expensive colleges in fees scoring', () => {
        const expensiveCollege = {
            ...mockCollege,
            courseFees: [{ annual_fee_inr: 500000 }],
        };

        const weights = { placement: 0.33, fees: 0.33, location: 0.34 };
        const result = calculateScore(expensiveCollege, weights);

        expect(result.dimension_scores.fees_score).toBeLessThan(30);
    });

    // Test 4: Low placement scenario
    it('should handle low placement packages', () => {
        const lowPlacementCollege = {
            ...mockCollege,
            placementStats: [{ avg_package: 4, year: 2024 }],
        };

        const weights = { placement: 1, fees: 0, location: 0 };
        const result = calculateScore(lowPlacementCollege, weights);

        expect(result.overall_score).toBeLessThan(50);
    });

    // Test 5: Tier-1 city location bonus
    it('should give higher location score for tier-1 cities', () => {
        const delhiCollege = { ...mockCollege, city: 'Delhi' };
        const otherCollege = { ...mockCollege, city: 'Hisar' };

        const weights = { placement: 0, fees: 0, location: 1 };
        const delhiResult = calculateScore(delhiCollege, weights);
        const otherResult = calculateScore(otherCollege, weights);

        expect(delhiResult.overall_score).toBeGreaterThan(otherResult.overall_score);
    });
});
