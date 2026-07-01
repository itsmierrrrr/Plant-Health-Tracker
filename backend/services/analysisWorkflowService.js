import { PlantAnalysis } from '../models/PlantAnalysis.js';
import { identifyPlantWithPlantNet } from './plantnetService.js';
import { buildCareInsights, buildPlantRecommendations, calculatePlantHealthScore } from './analysisService.js';

function buildFallbackCareInsights(document) {
  return buildCareInsights(
    document?.commonName || '',
    document?.scientificName || '',
    document?.healthScore || 0,
    document?.confidence || 0
  );
}

export function normalizeAnalysisDocument(document) {
  if (!document) {
    return null;
  }

  const careInsights = document.careInsights || buildFallbackCareInsights(document);

  return {
    id: document._id.toString(),
    imageUrl: document.imageUrl,
    commonName: document.commonName,
    scientificName: document.scientificName,
    confidence: document.confidence,
    healthScore: document.healthScore,
    recommendations: document.recommendations,
    careInsights,
    createdAt: document.createdAt,
  };
}

export async function processPlantAnalysis({ filePath, fileName, imageUrl, userId }) {
  const identification = await identifyPlantWithPlantNet({ filePath, fileName });
  const healthScore = calculatePlantHealthScore(identification.confidence);
  const recommendations = buildPlantRecommendations(identification.commonName, identification.scientificName, healthScore);
  const careInsights = buildCareInsights(identification.commonName, identification.scientificName, healthScore, identification.confidence);

  const savedAnalysis = await PlantAnalysis.create({
    userId,
    imageUrl,
    commonName: identification.commonName,
    scientificName: identification.scientificName,
    confidence: identification.confidence,
    healthScore,
    recommendations,
    careInsights,
  });

  return {
    analysis: normalizeAnalysisDocument(savedAnalysis),
    identification,
  };
}
