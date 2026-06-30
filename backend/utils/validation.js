import mongoose from 'mongoose';

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function validateAnalysisPayload({ file, imageUrl, commonName, scientificName, confidence }) {
  const errors = [];

  if (!file && (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0)) {
    errors.push('An uploaded image or imageUrl is required');
  }

  if (commonName !== undefined && (typeof commonName !== 'string' || commonName.trim().length === 0 || commonName.length > 120)) {
    errors.push('commonName must be a non-empty string up to 120 characters');
  }

  if (scientificName !== undefined && (typeof scientificName !== 'string' || scientificName.trim().length === 0 || scientificName.length > 160)) {
    errors.push('scientificName must be a non-empty string up to 160 characters');
  }

  if (confidence !== undefined) {
    const numericConfidence = Number(confidence);

    if (Number.isNaN(numericConfidence) || numericConfidence < 0 || numericConfidence > 100) {
      errors.push('confidence must be a number between 0 and 100');
    }
  }

  return errors;
}
