import { Router } from 'express';
import { handle_schedule } from './controllers/schedule-main-controller.js';
// import { handle_report } from './controllers/report-main-controller.js';
import { login } from './controllers/login-controller.js';
import { userAuthMiddleware } from './middleware/middleware.js';

const router = Router();

router.post('/api/scheduling-system', handle_schedule);
router.get('/api/reporting-system', userAuthMiddleware, handle_schedule);
router.post('/api/login', login);

export default router;
