import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { AppError } from '../utils/AppError.js';
import { buildCareInsights, buildPlantRecommendations, calculatePlantHealthScore } from './analysisService.js';

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1';
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  const siteUrl = process.env.OPENROUTER_SITE_URL || '';
  const appName = process.env.OPENROUTER_APP_NAME || 'Plant Health Tracker';

  if (!apiKey) {
    throw new AppError('OPENROUTER_API_KEY is required', 500);
  }

  return { apiKey, baseUrl, model, siteUrl, appName };
}

function buildImageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new AppError('Uploaded image is missing or invalid', 400);
  }

  const fileExtension = path.extname(filePath).toLowerCase();
  const mimeType = fileExtension === '.png' ? 'image/png' : fileExtension === '.webp' ? 'image/webp' : 'image/jpeg';
  const imageBuffer = fs.readFileSync(filePath);

  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}

function extractMessageContent(responseData) {
  const content = responseData?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }

  if (typeof content === 'string') {
    return content.trim();
  }

  return '';
}

function parseJsonResponse(content) {
  const trimmed = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new AppError('OpenRouter returned an invalid analysis payload', 502);
  }

  return JSON.parse(trimmed.slice(startIndex, endIndex + 1));
}

function normalizeConfidence(score) {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore) || numericScore <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericScore)));
}

function normalizeRecommendedStrings(items, fallbackItems) {
  if (Array.isArray(items)) {
    const cleanedItems = items
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (cleanedItems.length > 0) {
      return cleanedItems;
    }
  }

  return fallbackItems;
}

function normalizeAnalysisInsights(payload, commonName, scientificName, healthScore, confidence) {
  const fallbackInsights = buildCareInsights(commonName, scientificName, healthScore, confidence);
  const parsedInsights = payload?.careInsights && typeof payload.careInsights === 'object' ? payload.careInsights : {};

  return {
    waterNeed: typeof parsedInsights.waterNeed === 'string' && parsedInsights.waterNeed.trim().length > 0 ? parsedInsights.waterNeed.trim() : fallbackInsights.waterNeed,
    sunlightNeed: typeof parsedInsights.sunlightNeed === 'string' && parsedInsights.sunlightNeed.trim().length > 0 ? parsedInsights.sunlightNeed.trim() : fallbackInsights.sunlightNeed,
    soilTemperature: typeof parsedInsights.soilTemperature === 'string' && parsedInsights.soilTemperature.trim().length > 0 ? parsedInsights.soilTemperature.trim() : fallbackInsights.soilTemperature,
    leafCondition: typeof parsedInsights.leafCondition === 'string' && parsedInsights.leafCondition.trim().length > 0 ? parsedInsights.leafCondition.trim() : fallbackInsights.leafCondition,
    soilMoisture: typeof parsedInsights.soilMoisture === 'string' && parsedInsights.soilMoisture.trim().length > 0 ? parsedInsights.soilMoisture.trim() : fallbackInsights.soilMoisture,
    humidity: typeof parsedInsights.humidity === 'string' && parsedInsights.humidity.trim().length > 0 ? parsedInsights.humidity.trim() : fallbackInsights.humidity,
    pestRisk: typeof parsedInsights.pestRisk === 'string' && parsedInsights.pestRisk.trim().length > 0 ? parsedInsights.pestRisk.trim() : fallbackInsights.pestRisk,
    careNotes: normalizeRecommendedStrings(parsedInsights.careNotes, fallbackInsights.careNotes),
  };
}

function normalizeOpenRouterAnalysisResponse(payload, identification) {
  const parsed = payload || {};
  const commonName = identification?.commonName || 'Unknown plant';
  const scientificName = identification?.scientificName || 'Unknown species';
  const confidence = identification?.confidence ?? 0;
  const healthScore = Number.isFinite(Number(parsed.healthScore))
    ? Math.max(0, Math.min(100, Math.round(Number(parsed.healthScore))))
    : calculatePlantHealthScore(confidence);
  const recommendations = normalizeRecommendedStrings(
    parsed.recommendations,
    buildPlantRecommendations(commonName, scientificName, healthScore)
  );

  return {
    healthScore,
    recommendations,
    careInsights: normalizeAnalysisInsights(parsed, commonName, scientificName, healthScore, confidence),
    analysisSummary: typeof parsed.analysisSummary === 'string' && parsed.analysisSummary.trim().length > 0 ? parsed.analysisSummary.trim() : undefined,
    confidence: confidence > 0 ? confidence : normalizeConfidence(parsed.confidence),
  };
}

export async function analyzePlantWithOpenRouter({ filePath, fileName, identification }) {
  const { apiKey, baseUrl, model, siteUrl, appName } = getOpenRouterConfig();
  const imageDataUri = buildImageDataUri(filePath);
  const plantName = identification?.commonName || 'Unknown plant';
  const scientificName = identification?.scientificName || 'Unknown species';
  const confidence = identification?.confidence ?? 0;

  const prompt = [
    'You are analyzing a plant image after the plant has already been identified by PlantNet.',
    `PlantNet identification: common name ${plantName}; scientific name ${scientificName}; match confidence ${confidence}%.`,
    'Return only valid JSON with the following keys:',
    '{"healthScore":0-100,"recommendations":["string"],"careInsights":{"waterNeed":"string","sunlightNeed":"string","soilTemperature":"string","leafCondition":"string","soilMoisture":"string","humidity":"string","pestRisk":"string","careNotes":["string"]},"analysisSummary":"string"}',
    'Focus on the plant condition, health status, and practical care guidance for this specific plant.',
    'HealthScore must be an integer from 0 to 100.',
    'Provide 3 to 6 concise care recommendations.',
    'Do not wrap the JSON in markdown fences or add extra commentary.',
  ].join(' ');

  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, '')}/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a plant health analysis assistant. Respond with strict JSON only.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: `${prompt} File name: ${fileName || 'plant-image.jpg'}.` },
              { type: 'image_url', image_url: { url: imageDataUri } },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(siteUrl ? { 'HTTP-Referer': siteUrl } : {}),
          'X-Title': appName,
        },
        timeout: 45000,
      }
    );

    const content = extractMessageContent(response.data);

    if (!content) {
      throw new AppError('OpenRouter returned an empty response', 502);
    }

    return normalizeOpenRouterAnalysisResponse(parseJsonResponse(content), identification);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status || 502;
      const responseMessage = error.response.data?.error?.message || error.response.data?.message || 'OpenRouter API request failed';
      throw new AppError(responseMessage, statusCode >= 400 && statusCode < 500 ? 502 : 502, {
        providerStatus: statusCode,
        providerMessage: responseMessage,
      });
    }

    if (error.code === 'ENOENT') {
      throw new AppError('Uploaded image file could not be read', 400);
    }

    if (error instanceof SyntaxError) {
      throw new AppError('OpenRouter returned malformed JSON', 502, { providerMessage: error.message });
    }

    throw new AppError(
      `OpenRouter request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      502,
      { providerMessage: 'Network or timeout error while calling OpenRouter' }
    );
  }
}