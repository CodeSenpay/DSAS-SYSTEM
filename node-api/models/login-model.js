const JWT_SECRET = process.env.JWT_SECRET;
import pool from "../config/db.conf.js";
import crypto from "crypto";
import transporter from "../middleware/mailer.js";
import { console } from "inspector";

async function loginUser(data) {
  try {
    const { email, password } = data;
    const payload = JSON.stringify({ email });
    const [result] = await pool.query(`CALL login_user(?)`, [payload]);
    
    const userResult = result?.[0]?.[0]?.result;

    if (!userResult || userResult.status !== 200) {
      return {
        success: false,
        status: userResult?.status || 500,
        message: userResult?.message || "Login failed",
      };
    }

    const storedPassword = userResult.user_data?.password;
    const isMatch = await comparePassword(password, storedPassword);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return {
      success: true,
      message: "Login successful",
      user: userResult.user_data,
    };
  } catch (error) {
    throw {
      status: error.status || 500,
      message: "Internal server error",
      details: error.message,
    };
  }
}

async function logoutUser(req, res){
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
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}

async function comparePassword(inputPassword, storedPassword) {
  const hash = crypto.createHmac("sha256", process.env.SECRET_KEY)
    .update(inputPassword)
    .digest("hex");

  if(hash === storedPassword){
    return true;
  }else{
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

    if (insertResult[0][0].result.status === 200 && mailResult.accepted.length > 0) {
      return { success: true, message: "OTP sent to email", mailResult };
    } else if (insertResult[0][0].result.status !== 200) {
      return { success: false, message: "Failed to insert OTP" };
    } else {
      return { success: false, message: "Failed to send OTP email" };
    }
  } catch (error) {
    return { success: false, message: "Failed to send OTP", error: error.message };
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

export { loginUser, logoutUser, sendOtpToEmail, verifyOtp };
