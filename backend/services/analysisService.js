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

function getCareRange(healthScore, healthyValue, monitorValue, attentionValue) {
  if (healthScore >= 85) {
    return healthyValue;
  }

  if (healthScore >= 65) {
    return monitorValue;
  }

  return attentionValue;
}

export function buildCareInsights(commonName = '', scientificName = '', healthScore = 0, confidence = 0) {
  const plantType = buildPlantType(commonName, scientificName);
  const riskLevel = confidence >= 80 ? 'Low' : confidence >= 60 ? 'Moderate' : 'High';

  return {
    waterNeed: getCareRange(healthScore, 'Light watering', 'Moderate watering', 'Frequent checking'),
    sunlightNeed: getCareRange(healthScore, 'Bright indirect light', 'Filtered indoor light', 'Stable indirect light'),
    soilTemperature: getCareRange(healthScore, '20-26°C', '18-24°C', '18-22°C'),
    leafCondition: getCareRange(healthScore, 'Leaves look vibrant', 'Leaves show mild stress', 'Leaves need attention'),
    soilMoisture: getCareRange(healthScore, 'Slightly moist', 'Evenly moist', 'Dry or waterlogged check'),
    humidity: getCareRange(healthScore, 'Moderate humidity', 'Balanced humidity', 'Higher humidity recommended'),
    pestRisk: riskLevel,
    careNotes: [
      `${plantType || 'This plant'} is being estimated from the PlantNet match and health score.`,
      getCareRange(
        healthScore,
        'Keep the plant in steady conditions and avoid overwatering.',
        'Watch for leaf droop or soil drying between watering.',
        'Check soil, roots, and light exposure immediately.'
      ),
    ],
  };
}
