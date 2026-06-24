import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/response.js';

export function notFound(request, response, next) {
  next(new AppError(`Route not found: ${request.originalUrl}`, 404));
}

export function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (error.name === 'MulterError') {
    return sendError(response, 400, error.message);
  }

  if (error.message === 'Only JPG, JPEG, and PNG images are allowed') {
    return sendError(response, 400, error.message);
  }

  if (error.name === 'CastError') {
    return sendError(response, 400, 'Invalid resource identifier');
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return sendError(response, statusCode, message, error.details);
}