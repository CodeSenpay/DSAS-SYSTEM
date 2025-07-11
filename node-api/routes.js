import cookieParser from "cookie-parser";
import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
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
import { generateSchoolYear, generateSemester } from "./services/utility.js";
const router = Router();
const upload = multer({ dest: "uploads/" });

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cookieParser());
router.post("/api/scheduling-system/admin", authenticate, handle_schedule);
router.post("/api/scheduling-system/user", handle_schedule);
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
router.get("/api/utility/school-year", (req, res) => {
  res.json({ schoolYear: generateSchoolYear() });
});
router.get("/api/utility/semester", (req, res) => {
  res.json({ semester: generateSemester() });
});

router.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const compressedBuffer = await sharp(file.path)
      .resize(800) // Resize width to 800px, maintain aspect ratio
      .jpeg({ quality: 70 }) // Convert to JPEG with 70% quality
      .toBuffer();

    const base64 = compressedBuffer.toString("base64");

    // Clean up original file
    await fs.unlink(file.path);

    res.json({ base64 });
  } catch (error) {
    console.error("Compression error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
