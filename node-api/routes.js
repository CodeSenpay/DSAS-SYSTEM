import cookieParser from "cookie-parser";
import { Router } from "express";
import {
  getUserDataController,
  loginAdminController,
  loginStudentController,
  logoutStudentController,
  logoutUserController,
  sendOtp,
  verifyJwt,
  verifyOtpController,
} from "./controllers/login-controller.js";
import { register } from "./controllers/register-controller.js";
import { handle_schedule } from "./controllers/schedule-main-controller.js";
import { authenticate } from "./middleware/middleware.js";

const router = Router();

router.use(cookieParser());
router.post("/api/scheduling-system/admin", authenticate, handle_schedule);
router.post("/api/scheduling-system/user", handle_schedule); //temporary
router.get("/api/reporting-system", authenticate, handle_schedule);
router.post("/api/login-admin", loginAdminController);
router.post("/api/login-student", loginStudentController);
router.post("/api/logout/user", logoutUserController);
router.post("/api/logout/student", logoutStudentController);
router.post("/api/register", register);
router.post("/api/send-otp", sendOtp);
router.post("/api/verify-otp", verifyOtpController);
router.get("/api/auth/verify-jwt", verifyJwt);
router.post("/api/auth/get-user-data", getUserDataController);
router.post("/api/jrmsu/college-departments", handle_schedule);

export default router;
