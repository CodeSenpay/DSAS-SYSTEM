import jwt from "jsonwebtoken";
import { loginUser, logoutUser, sendOtpToEmail, verifyOtp } from "../models/login-model.js";
import logger from "../middleware/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided." });
  }

  try {
    const { email, password } = req.body;
    const response = await loginUser({ email, password });

    logger(
      {
        action: "login_attempt",
        user_id: response.user?.id || "none",
        details: `User login attempt: ${response.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );

    if (!response.success) {
      return res
        .status(response.status || 401)
        .json({
          success: false,
          message: response.message || "Invalid credentials.",
        });
    }

    const userId = response.user?.id || response.user?._id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({ success: true, user: response.user });
  } catch (error) {
    console.error("Login error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

async function logout(req, res) {
  try {
    const response = await logoutUser(req, res);
    logger(
      {
        action: "logout",
        user_id: response.user?.id || "none",
        details: `User logout attempt: ${response.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
  } catch (error) {
    console.error("Logout error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

async function sendOtp(req, res){
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const otpResponse = await sendOtpToEmail(email);
    if (otpResponse.success) {
      return res.json({ success: true, message: "OTP sent to email." });
    } else {
      return res.status(otpResponse.status || 500).json({
        success: false,
        message: otpResponse.message || "Failed to send OTP.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function verifyOtpController(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  try {
    const result = await verifyOtp(email, otp);
    console.log("Verify OTP Result:", result[0][0].result)

    const verifyResult = result[0][0].result;

    if (verifyResult?.status === 200) {
      return res.json({ success: true, message: "OTP verified successfully." });
    } else {
      return res.status(401).json({ success: false, message: verifyResult?.message || "Invalid OTP." });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
  }
}

export { login, logout, sendOtp, verifyOtpController };
