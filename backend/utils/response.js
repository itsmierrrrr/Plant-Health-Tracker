export function sendSuccess(response, statusCode, message, data = {}) {
  return response.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
}

export function sendError(response, statusCode, message, details = undefined) {
  return response.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
