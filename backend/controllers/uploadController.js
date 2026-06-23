import { mapUploadFile } from '../services/uploadService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const uploadPlantImage = asyncHandler(async (request, response) => {
  if (!request.file) {
    throw new AppError('No image file received', 400);
  }

  const fileInfo = mapUploadFile(request, request.file);

  return sendSuccess(response, 201, 'Image uploaded successfully', {
    data: fileInfo,
  });
});
