import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { AppError } from '../utils/AppError.js';

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

function normalizeOpenRouterResponse(payload) {
  const parsed = payload || {};
  const commonName = typeof parsed.commonName === 'string' && parsed.commonName.trim().length > 0 ? parsed.commonName.trim() : 'Unknown plant';
  const scientificName = typeof parsed.scientificName === 'string' && parsed.scientificName.trim().length > 0 ? parsed.scientificName.trim() : 'Unknown species';

  return {
    commonName,
    scientificName,
    confidence: normalizeConfidence(parsed.confidence),
    plantType: `${commonName} ${scientificName}`.trim(),
    matched: Boolean(parsed.matched ?? (commonName !== 'Unknown plant' || scientificName !== 'Unknown species')),
    rawMatch: {
      source: 'openrouter',
      model: parsed.model || undefined,
      notes: parsed.notes || parsed.reasoning || undefined,
    },
  };
}

export async function identifyPlantWithOpenRouter({ filePath, fileName }) {
  const { apiKey, baseUrl, model, siteUrl, appName } = getOpenRouterConfig();
  const imageDataUri = buildImageDataUri(filePath);

  const prompt = [
    'Identify the plant in the image as accurately as possible.',
    'Return only valid JSON with the following keys:',
    '{"commonName":"string","scientificName":"string","confidence":0-100,"matched":true|false,"notes":"short reasoning"}',
    'Use the plant that best matches the image. If you are uncertain, set matched to false and use Unknown plant / Unknown species.',
    'Confidence must be an integer from 0 to 100.',
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
            content: 'You are a plant identification assistant. Respond with strict JSON only.',
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

    return normalizeOpenRouterResponse(parseJsonResponse(content));
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