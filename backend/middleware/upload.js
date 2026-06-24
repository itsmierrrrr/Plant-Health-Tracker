import multer from 'multer';
import fs from 'fs';
import path from 'path';

function resolveUploadDirectory() {
  const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, resolveUploadDirectory());
  },
  filename(request, file, callback) {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${uniquePrefix}${extension}`);
  },
});

function fileFilter(request, file, callback) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    callback(new Error('Only JPG, JPEG, and PNG images are allowed'));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
  },
});

export function getUploadDirectory() {
  return resolveUploadDirectory();
}
