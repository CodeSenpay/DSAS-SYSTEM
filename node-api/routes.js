import { Router } from 'express';
import { handle } from './controllers/main-controller.js';
import { login } from './controllers/login-controller.js';
import { userAuthMiddleware } from './middleware/middleware.js';

const router = Router();

router.post('/api/scheduling-system', userAuthMiddleware, handle);
router.get('/api/reporting-system', userAuthMiddleware, handle);
router.post('/api/login', login);

export default router;
