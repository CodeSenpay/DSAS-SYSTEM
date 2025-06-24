import cookieParser from "cookie-parser";
import { Router } from "express";
import { login ,logout, sendOtp, verifyOtpController} from "./controllers/login-controller.js";
import { register } from "./controllers/register-controller.js";
import { handle_schedule } from "./controllers/schedule-main-controller.js";
import { authenticate } from "./middleware/middleware.js";

const router = Router();

router.use(cookieParser());
router.post("/api/scheduling-system/admin", authenticate, handle_schedule);
router.post("/api/scheduling-system/user", handle_schedule); //temporary
router.get("/api/reporting-system", authenticate, handle_schedule);
router.post("/api/login", login);
router.post("/api/logout", logout);
router.post("/api/register", register);
router.post("/api/send-otp", sendOtp);
router.post("/api/verify-otp", verifyOtpController);

export default router;
