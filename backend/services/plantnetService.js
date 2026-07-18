import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { AppError } from '../utils/AppError.js';

function getPlantNetConfig() {
  const apiKey = process.env.PLANTNET_API_KEY;
  const baseUrl = process.env.PLANTNET_API_BASE_URL || 'https://my-api.plantnet.org';
  const project = process.env.PLANTNET_PROJECT || 'all';
  const lang = process.env.PLANTNET_LANG || 'en';
  const defaultOrgan = process.env.PLANTNET_DEFAULT_ORGAN || 'leaf';

  if (!apiKey) {
    throw new AppError('PLANTNET_API_KEY is required', 500);
  }

  return { apiKey, baseUrl, project, lang, defaultOrgan };
}

function buildFileStream(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new AppError('Uploaded image is missing or invalid', 400);
  }

  return fs.createReadStream(filePath);
}

function normalizeConfidence(score) {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore) || numericScore <= 0) {
    return 0;
  }

  if (numericScore <= 1) {
    return Math.max(0, Math.min(100, Math.round(numericScore * 100)));
  }

  return Math.max(0, Math.min(100, Math.round(numericScore)));
}

function getTopSpeciesName(species = {}) {
  if (typeof species.scientificNameWithoutAuthor === 'string' && species.scientificNameWithoutAuthor.trim().length > 0) {
    return species.scientificNameWithoutAuthor.trim();
  }

  if (typeof species.scientificName === 'string' && species.scientificName.trim().length > 0) {
    return species.scientificName.trim();
  }

  if (typeof species.genus?.scientificNameWithoutAuthor === 'string' && species.genus.scientificNameWithoutAuthor.trim().length > 0) {
    return species.genus.scientificNameWithoutAuthor.trim();
  }

  return 'Unknown species';
}

function getTopCommonName(species = {}) {
  if (Array.isArray(species.commonNames)) {
    const firstCommonName = species.commonNames.find((name) => typeof name === 'string' && name.trim().length > 0);
    if (firstCommonName) {
      return firstCommonName.trim();
    }
  }

  if (typeof species.commonName === 'string' && species.commonName.trim().length > 0) {
    return species.commonName.trim();
  }

  return 'Unknown plant';
}

function normalizePlantNetResponse(payload) {
  const results = Array.isArray(payload?.results) ? payload.results : [];
  const topResult = results[0] || {};
  const species = topResult.species || {};
  const commonName = getTopCommonName(species);
  const scientificName = getTopSpeciesName(species);
  const confidence = normalizeConfidence(topResult.score);

  return {
    commonName,
    scientificName,
    confidence,
    plantType: `${commonName} ${scientificName}`.trim(),
    matched: confidence > 0,
    rawMatch: {
      source: 'plantnet',
      project: payload?.project?.name || payload?.project || undefined,
      score: topResult.score,
      family: species.family?.scientificName || species.family || undefined,
      genus: species.genus?.scientificNameWithoutAuthor || undefined,
      suggestions: results.slice(0, 3).map((result) => ({
        scientificName: getTopSpeciesName(result.species || {}),
        commonName: getTopCommonName(result.species || {}),
        score: normalizeConfidence(result.score),
      })),
    },
  };
}

export async function identifyPlantWithPlantNet({ filePath, fileName }) {
  const { apiKey, baseUrl, project, lang, defaultOrgan } = getPlantNetConfig();
  const formData = new FormData();
  const imageStream = buildFileStream(filePath);

  formData.append('images', imageStream, {
    filename: fileName || path.basename(filePath),
  });
  formData.append('organs', defaultOrgan);

  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, '')}/v2/identify/${encodeURIComponent(project)}`,
      formData,
      {
        params: {
          'api-key': apiKey,
          lang,
          'include-related-images': false,
        },
        headers: formData.getHeaders(),
        timeout: 45000,
      }
    );

    if (!response.data) {
      throw new AppError('PlantNet returned an empty response', 502);
    }

    return normalizePlantNetResponse(response.data);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status || 502;
      const responseMessage = error.response.data?.message || error.response.data?.error?.message || 'PlantNet API request failed';
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