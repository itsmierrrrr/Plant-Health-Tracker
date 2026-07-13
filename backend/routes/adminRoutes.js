import { Router } from 'express';
import { getAdminOverview } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/overview', getAdminOverview);

export default router;