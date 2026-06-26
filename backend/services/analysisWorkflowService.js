import { PlantAnalysis } from '../models/PlantAnalysis.js';
import { identifyPlantWithPlantNet } from './plantnetService.js';
import { buildPlantRecommendations, calculatePlantHealthScore } from './analysisService.js';

export function normalizeAnalysisDocument(document) {
  if (!document) {
    return null;
  }

  return {
    id: document._id.toString(),
    imageUrl: document.imageUrl,
    commonName: document.commonName,
    scientificName: document.scientificName,
    confidence: document.confidence,
    healthScore: document.healthScore,
    recommendations: document.recommendations,
    createdAt: document.createdAt,
  };
}

export async function processPlantAnalysis({ filePath, fileName, imageUrl, userId }) {
  const identification = await identifyPlantWithPlantNet({ filePath, fileName });
  const healthScore = calculatePlantHealthScore(identification.confidence);
  const recommendations = buildPlantRecommendations(identification.commonName, identification.scientificName, healthScore);

  const savedAnalysis = await PlantAnalysis.create({
    userId,
    imageUrl,
    commonName: identification.commonName,
    scientificName: identification.scientificName,
    confidence: identification.confidence,
    healthScore,
    recommendations,
  });

  return {
    analysis: normalizeAnalysisDocument(savedAnalysis),
    identification,
  };
}
