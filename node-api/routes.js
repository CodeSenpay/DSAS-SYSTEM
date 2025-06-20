import cookieParser from "cookie-parser";
import { Router } from "express";
import { login } from "./controllers/login-controller.js";
import { handle_schedule } from "./controllers/schedule-main-controller.js";
import { authenticate } from "./middleware/middleware.js";

const router = Router();

router.use(cookieParser());
router.post("/api/scheduling-system/admin", authenticate, handle_schedule);
router.post("/api/scheduling-system/user", handle_schedule); //temporary
router.get("/api/reporting-system", authenticate, handle_schedule);
router.post("/api/login", login);

export default router;
