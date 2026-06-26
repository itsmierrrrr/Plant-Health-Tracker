import { Router } from 'express';
import { deleteAnalysisById, getAllAnalyses, getAnalysisById, analyzePlantImage } from '../controllers/analysisController.js';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', upload.single('image'), analyzePlantImage);
router.get('/', getAllAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysisById);

export default router;
