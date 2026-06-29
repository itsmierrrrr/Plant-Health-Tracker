function normalizeConfidence(confidence) {
  if (typeof confidence !== 'number' || Number.isNaN(confidence)) {
    return 0;
  }

  if (confidence <= 1) {
    return Math.round(confidence * 100);
  }

  return Math.max(0, Math.min(100, Math.round(confidence)));
}

export function generateHealthScore(confidence, modifiers = []) {
  const normalizedConfidence = normalizeConfidence(confidence);
  const modifierTotal = modifiers.reduce((total, modifier) => total + modifier, 0);
  const rawScore = normalizedConfidence + modifierTotal;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}
