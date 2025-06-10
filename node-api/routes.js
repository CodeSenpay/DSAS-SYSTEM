import { Router } from 'express';
import { handle } from './controllers/main-controller.js';

const router = Router();
// router.get('/', handle);
router.post('/api', handle);

export default router;
