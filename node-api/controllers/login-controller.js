import jwt from "jsonwebtoken";
import { loginUser, logoutUser } from "../models/login-model.js";
import logger from "../middleware/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided." });
  }

  try {
    const response = await loginUser(req.body);
    console.log("Login_Controller response:", response);

    logger(
      {
        action: "login_attempt",
        user_id: response.user?.id || "none",
        details: `User login attempt: ${response.message}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),

      },
      req,
      res
    );

    if (!response.success) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const userId = response.user?.id || response.user?._id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({ success: true });
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
    await logoutUser(req, res);
  } catch (error) {
    console.error("Logout error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}

export { login, logout };
