import { calculateScore, runScoringTests } from './scoring.js';

// Run unit tests when module is imported
if (process.env.NODE_ENV === 'test') {
    runScoringTests();
}

export { calculateScore, runScoringTests };
