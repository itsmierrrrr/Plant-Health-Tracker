import { generateHealthScore } from '../utils/healthScore.js';
import { generateRecommendations } from '../utils/recommendationEngine.js';

export function getHealthModifiers(confidence) {
  if (confidence >= 80) {
    return [6];
  }

  if (confidence >= 60) {
    return [0];
  }

  return [-8];
}

export function buildPlantType(commonName = '', scientificName = '') {
  return `${commonName} ${scientificName}`.trim();
}

export function calculatePlantHealthScore(confidence) {
  return generateHealthScore(confidence, getHealthModifiers(confidence));
}

export function buildPlantRecommendations(commonName = '', scientificName = '', healthScore = 0) {
  return generateRecommendations({
    plantType: buildPlantType(commonName, scientificName),
    healthScore,
  });
}
