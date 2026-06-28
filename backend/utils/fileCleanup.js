import fs from 'fs/promises';

export async function safeDeleteFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    console.warn(`Unable to remove file: ${filePath}`);
  }
}
