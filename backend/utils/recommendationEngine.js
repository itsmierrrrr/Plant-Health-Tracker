const plantAdvice = {
  succulent: ['Reduce watering frequency and ensure the pot drains well.', 'Place the plant in bright indirect light.'],
  tropical: ['Maintain steady humidity and avoid cold drafts.', 'Rotate the pot weekly for even growth.'],
  foliage: ['Wipe leaves gently to keep them photosynthesis-ready.', 'Use consistent watering to avoid stress spikes.'],
  flowering: ['Provide a balanced feeding schedule during active growth.', 'Remove spent blooms to support healthy regrowth.'],
  default: ['Keep the plant in bright indirect light.', 'Monitor soil moisture before watering again.'],
};

function getPlantCategory(plantType = '') {
  const normalizedType = plantType.toLowerCase();

  if (normalizedType.includes('succulent') || normalizedType.includes('cactus')) {
    return 'succulent';
  }

  if (normalizedType.includes('orchid') || normalizedType.includes('fern') || normalizedType.includes('monstera') || normalizedType.includes('pothos')) {
    return 'tropical';
  }

  if (normalizedType.includes('flower') || normalizedType.includes('rose') || normalizedType.includes('bloom')) {
    return 'flowering';
  }

  if (normalizedType.includes('fig') || normalizedType.includes('snake') || normalizedType.includes('plant')) {
    return 'foliage';
  }

  return 'default';
}

export function generateRecommendations({ plantType = '', healthScore = 0 }) {
  const category = getPlantCategory(plantType);
  const recommendations = [...plantAdvice[category]];

  if (healthScore < 40) {
    recommendations.unshift('Inspect the plant immediately for pests, root issues, or dehydration.');
  } else if (healthScore < 70) {
    recommendations.unshift('Address early stress by tightening watering and light consistency.');
  } else {
    recommendations.unshift('Keep the current care routine consistent to maintain the plant’s condition.');
  }

  return recommendations.slice(0, 4);
}
