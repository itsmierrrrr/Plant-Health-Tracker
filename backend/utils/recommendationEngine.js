const plantAdvice = {
  succulent: [
    'Reduce watering frequency and let the soil dry fully between sessions.',
    'Place the plant in bright indirect light with strong airflow.',
    'Use a fast-draining soil mix to protect the roots from rot.',
  ],
  tropical: [
    'Maintain steady humidity and avoid cold drafts.',
    'Rotate the pot weekly for even growth and balanced leaf exposure.',
    'Keep the soil lightly moist, not saturated.',
  ],
  foliage: [
    'Wipe leaves gently to keep them photosynthesis-ready.',
    'Use consistent watering to avoid stress spikes.',
    'Inspect the underside of leaves for early pest activity.',
  ],
  flowering: [
    'Provide a balanced feeding schedule during active growth.',
    'Remove spent blooms to support healthy regrowth.',
    'Keep light stable to reduce bloom drop.',
  ],
  default: [
    'Keep the plant in bright indirect light.',
    'Monitor soil moisture before watering again.',
    'Check for leaf yellowing or drooping after each watering cycle.',
  ],
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
    recommendations.push('Repot only if the roots are overcrowded, black, or mushy.');
  } else if (healthScore < 70) {
    recommendations.unshift('Address early stress by tightening watering and light consistency.');
    recommendations.push('Check the soil depth before adding more water or fertilizer.');
  } else {
    recommendations.unshift('Keep the current care routine consistent to maintain the plant’s condition.');
    recommendations.push('Review new growth weekly so you can catch changes early.');
  }

  recommendations.push('Make sure the pot drains well and never sits in standing water.');

  return recommendations.slice(0, 6);
}
