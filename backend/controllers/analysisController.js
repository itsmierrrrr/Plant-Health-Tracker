import { mapUploadFile } from '../services/uploadService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { isValidObjectId, validateAnalysisPayload } from '../utils/validation.js';
import { normalizeAnalysisDocument, processPlantAnalysis } from '../services/analysisWorkflowService.js';
import { PlantAnalysis } from '../models/PlantAnalysis.js';
import { safeDeleteFile } from '../utils/fileCleanup.js';

function getAnalysisInput(request) {
  const file = request.file;
  const body = request.body || {};
  const uploadedFile = file ? mapUploadFile(request, file) : null;

  return {
    imageUrl: uploadedFile?.imageUrl || body.imageUrl || null,
    fileName: file?.originalname || body.fileName || '',
    filePath: file?.path || null,
    commonName: typeof body.commonName === 'string' && body.commonName.trim().length > 0 ? body.commonName.trim() : undefined,
    scientificName: typeof body.scientificName === 'string' && body.scientificName.trim().length > 0 ? body.scientificName.trim() : undefined,
    confidence: body.confidence !== undefined && body.confidence !== '' ? Number(body.confidence) : undefined,
  };
}

export const analyzePlantImage = asyncHandler(async (request, response) => {
  const { imageUrl, fileName, filePath, commonName, scientificName, confidence } = getAnalysisInput(request);

  if (!request.file || !filePath) {
    throw new AppError('An uploaded image file is required for OpenRouter analysis', 400);
  }

  const validationErrors = validateAnalysisPayload({
    file: request.file,
    imageUrl,
    commonName,
    scientificName,
    confidence,
  });

  if (validationErrors.length > 0) {
    throw new AppError('Validation failed', 400, validationErrors);
  }

  if (!imageUrl) {
    throw new AppError('An image file or imageUrl is required for analysis', 400);
  }

  try {
    const { analysis } = await processPlantAnalysis({ filePath, fileName, imageUrl, userId: request.user._id });

    return sendSuccess(response, 201, 'Plant analysis created successfully', {
      data: analysis,
    });
  } catch (error) {
    await safeDeleteFile(filePath);
    throw error;
  }
});

export const getAllAnalyses = asyncHandler(async (request, response) => {
  const analyses = await PlantAnalysis.find({ userId: request.user._id }).sort({ createdAt: -1 });

  return sendSuccess(response, 200, 'Analysis records retrieved successfully', {
    data: analyses.map((analysis) => normalizeAnalysisDocument(analysis)),
  });
});

export const getAnalysisById = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid analysis id', 400);
  }

  const analysis = await PlantAnalysis.findOne({ _id: id, userId: request.user._id });

  if (!analysis) {
    throw new AppError('Analysis record not found', 404);
  }

  return sendSuccess(response, 200, 'Analysis record retrieved successfully', {
    data: normalizeAnalysisDocument(analysis),
  });
});

export const deleteAnalysisById = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid analysis id', 400);
  }

  const analysis = await PlantAnalysis.findOneAndDelete({ _id: id, userId: request.user._id });

  if (!analysis) {
    throw new AppError('Analysis record not found', 404);
  }

  return sendSuccess(response, 200, 'Analysis record deleted successfully', {
    data: normalizeAnalysisDocument(analysis),
  });
});
