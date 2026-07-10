import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { getUploadDirectory } from './middleware/upload.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const uploadDir = getUploadDirectory();

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'Plant Health Tracker API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/analysis', analysisRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase(process.env.MONGODB_URI);

    app.listen(port, () => {
      console.log(`Plant Health Tracker API running on port ${port}`);
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  disconnectDatabase().finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  disconnectDatabase().finally(() => process.exit(0));
});
