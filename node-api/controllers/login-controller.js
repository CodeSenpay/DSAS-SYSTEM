import jwt from "jsonwebtoken";
import { loginModel } from "../models/login-model.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided." });
  }

  try {
    const response = await loginModel(req.body);
    console.log("Login_Controller response:", response);

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

export { login };
