import { Router } from 'express';
import { handle_schedule } from './controllers/schedule-main-controller.js';
import cookieParser from 'cookie-parser';
import { login } from './controllers/login-controller.js';
import { authenticate } from './middleware/middleware.js';

const router = Router();

router.use(cookieParser());
router.post('/api/scheduling-system', authenticate, handle_schedule);
router.get('/api/reporting-system', authenticate, handle_schedule);
router.post('/api/login', login);

export default router;
