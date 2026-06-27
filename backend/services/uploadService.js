import path from 'path';

export function buildImageUrl(request, fileName) {
  if (!fileName) {
    return null;
  }

  const baseUrl = `${request.protocol}://${request.get('host')}`;
  return `${baseUrl}/uploads/${fileName}`;
}

export function mapUploadFile(request, file) {
  return {
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    imageUrl: buildImageUrl(request, file.filename),
    extension: path.extname(file.originalname).toLowerCase(),
  };
}
