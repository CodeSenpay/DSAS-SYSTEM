import pool from "../config/db.conf.js";
import crypto from "crypto";
import transporter from "../middleware/mailer.js";
import { console } from "inspector";
import logger from "../middleware/logger.js";
import axios from "axios";
const JWT_SECRET = process.env.JWT_SECRET;

async function loginAdmin(data, req, res) {
  try {
    const { email, password } = data;

    // Original function for non-student user levels
    const payload = JSON.stringify({ email });
    const [result] = await pool.query(`CALL login_user(?)`, [payload]);

    const userResult = result?.[0]?.[0]?.result;

    if (!userResult || userResult.status !== 200) {
      // Log failed login attempt
      await logger(
        {
          action: "login_attempt",
          user_id: email || null,
          details: `Failed login for email: ${email}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return {
        success: false,
        status: userResult?.status || 500,
        message: userResult?.message || "Login failed",
      };
    }

    const storedPassword = userResult.user_data?.password;
    const isMatch = await comparePassword(password, storedPassword);

    if (!isMatch) {
      // Log invalid credentials
      await logger(
        {
          action: "login_attempt",
          user_id: email || null,
          details: `Invalid password for email: ${email}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return {
        success: false,
        status: 409,
        message: "Invalid credentials",
      };
    }

    // Log successful login
    await logger(
      {
        action: "login_success",
        user_id: email || null,
        details: `User logged in: ${email}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );

    return {
      success: true,
      message: "Login successful",
      user: userResult.user_data,
    };
  } catch (error) {
    // Log error
    await logger(
      {
        action: "login_error",
        user_id: data?.email || null,
        details: `Login error for email: ${data?.email || "unknown"} - ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    throw {
      status: error.status || 500,
      message: "Internal server error",
      details: error.message,
    };
  }
}

// Sample loginArmsAPI function returning a sample login response from an API
async function loginStudent(params, req, res) {
  // First, get the ARMS token using registerToArmsToken
  const tokenResponse = await registerToArmsToken(
    params.student_id,
    params.password
  );

  if (!tokenResponse || !tokenResponse.success || !tokenResponse.token) {
    return {
      success: false,
      message: tokenResponse?.message || "Failed to get ARMS token",
      error: tokenResponse?.error || null,
    };
  }

  //TODO: Check in the local database first before logging in using the ARMS API

  const url =
    "https://jrmsu-arms.online/api/version-2/services/student/account/login";
  try {
    const response = await axios.post(
      url,
      {
        Username: params.student_id,
        Password: params.password,
      },
      {
        headers: {
          "Secret-Key": tokenResponse.Secret_Key,
          "User-Agent": "Coderstation-Protocol",
        },
      }
    );
    if (response.data && response.data.success) {
      return {
        success: true,
        message: "Login successful (ARMS API)",
        user: response.data.user || {},
        token: response.data.token || null,
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Login failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to login to ARMS API",
      error: error.response?.data?.message || error.message,
    };
  }
}

async function registerToArmsToken() {
  const key = process.env.API_KEY;
  const secret = process.env.API_SECRET;
  const url =
    "https://jrmsu-arms.online/api/version-2/services/credential/token/request";
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "Api-Key": key,
          "Api-Secret": secret,
          "User-Agent": "Coderstation-Protocol",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to register to ARMS token",
      error: error.message,
    };
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

async function comparePassword(inputPassword, storedPassword) {
  const hash = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(inputPassword)
    .digest("hex");

  if (hash === storedPassword) {
    return true;
  } else {
    return false;
  }
}

async function sendOtpToEmail(email) {
  const otp = generateOtp();
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    const mailResult = await transporter.sendMail(mailOptions);
    const insertResult = await insertOtpToDB(email, otp);

    if (
      insertResult[0][0].result.status === 200 &&
      mailResult.accepted.length > 0
    ) {
      return { success: true, message: "OTP sent to email", mailResult };
    } else if (insertResult[0][0].result.status !== 200) {
      return { success: false, message: "Failed to insert OTP" };
    } else {
      return { success: false, message: "Failed to send OTP email" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    };
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

async function insertOtpToDB(email, otp) {
  try {
    const payload = JSON.stringify({ email, otp });
    const [result] = await pool.query(`CALL insert_otp(?)`, [payload]);
    return result;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: "Failed to insert OTP",
      details: error.message,
    };
  }
}

async function verifyOtp(email, otp) {
  try {
    const payload = JSON.stringify({ email, otp });
    const [result] = await pool.query(`CALL verify_otp(?)`, [payload]);
    return result;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: "Failed to verify OTP",
      details: error.message,
    };
  }
}

export { loginAdmin, loginStudent, logoutUser, sendOtpToEmail, verifyOtp };
