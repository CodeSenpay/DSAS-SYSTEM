import { Router } from 'express';
import { handle } from './controllers/main-controller.js';
import { login } from './controllers/login-controller.js';

const router = Router();

router.post('/api/scheduling-system', handle);
router.get('/api/reporting-system', handle);
router.get('/api/login-system', login);

export default router;
