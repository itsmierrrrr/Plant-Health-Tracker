import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { AppError } from '../utils/AppError.js';

function getPlantNetConfig() {
  const apiKey = process.env.PLANTNET_API_KEY;
  const baseUrl = process.env.PLANTNET_API_BASE_URL || 'https://my-api.plantnet.org';
  const project = process.env.PLANTNET_API_PROJECT || 'all';
  const lang = process.env.PLANTNET_API_LANG || 'en';

  if (!apiKey) {
    throw new AppError('PLANTNET_API_KEY is required', 500);
  }

  return { apiKey, baseUrl, project, lang };
}

function buildIdentifyUrl() {
  const { apiKey, baseUrl, project, lang } = getPlantNetConfig();
  const identifyUrl = new URL(`/v2/identify/${project}`, baseUrl);
  identifyUrl.searchParams.set('api-key', apiKey);
  identifyUrl.searchParams.set('lang', lang);
  identifyUrl.searchParams.set('nb-results', '5');
  identifyUrl.searchParams.set('no-reject', 'true');
  identifyUrl.searchParams.set('include-related-images', 'false');
  return identifyUrl.toString();
}

function buildPlantNetFormData(filePath, fileName) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new AppError('Uploaded image is missing or invalid', 400);
  }

  const form = new FormData();
  form.append('images', fs.createReadStream(filePath), fileName || 'plant-image.jpg');
  form.append('organs', 'auto');
  return form;
}

function extractCommonName(species = {}) {
  if (Array.isArray(species.commonNames) && species.commonNames.length > 0) {
    return species.commonNames[0];
  }

  return species.genus?.scientificNameWithoutAuthor || species.scientificNameWithoutAuthor || species.scientificName || 'Unknown plant';
}

function extractScientificName(species = {}) {
  return species.scientificNameWithoutAuthor || species.scientificName || species.genus?.scientificNameWithoutAuthor || 'Unknown species';
}

function normalizeConfidence(score) {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore) || numericScore <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericScore * 100)));
}

export function normalizePlantNetResponse(payload) {
  const topResult = payload?.results?.[0];

  if (!topResult) {
    return {
      commonName: 'Unknown plant',
      scientificName: 'Unknown species',
      confidence: 0,
      plantType: 'unknown',
      matched: false,
      rawMatch: null,
    };
  }

  const species = topResult.species || {};
  const scientificName = extractScientificName(species);
  const commonName = extractCommonName(species);

  return {
    commonName,
    scientificName,
    confidence: normalizeConfidence(topResult.score),
    plantType: `${commonName} ${scientificName}`.trim(),
    matched: true,
    rawMatch: {
      score: topResult.score,
      scientificName: species.scientificName || scientificName,
      scientificNameWithoutAuthor: scientificName,
      commonNames: species.commonNames || [],
    },
  };
}

export async function identifyPlantWithPlantNet({ filePath, fileName }) {
  const identifyUrl = buildIdentifyUrl();
  const form = buildPlantNetFormData(filePath, fileName);

  try {
    const response = await axios.post(identifyUrl, form, {
      headers: form.getHeaders(),
      timeout: 30000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return normalizePlantNetResponse(response.data);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status || 502;
      const responseMessage = error.response.data?.message || error.response.data?.error || 'PlantNet API request failed';
      throw new AppError(responseMessage, statusCode >= 400 && statusCode < 500 ? 502 : 502, {
        providerStatus: statusCode,
        providerMessage: responseMessage,
      });
    }

    if (error.code === 'ENOENT') {
      throw new AppError('Uploaded image file could not be read', 400);
    }

    throw new AppError(
      `PlantNet request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      502,
      { providerMessage: 'Network or timeout error while calling PlantNet' }
    );
  }
}
