const JWT_SECRET = process.env.JWT_SECRET;
import pool from "../config/db.conf.js";
import crypto from "crypto";

async function loginUser(data) {
  try {
    const { email, password } = data;
    console.log(`email: ${email}`);
    const payload = JSON.stringify({ email });
    const [result] = await pool.query(`CALL login_user(?)`, [payload]);

    console.log("Result from stored procedure:", result[0]);

    // Check password
    const storedPassword = result[0][0].result.user_data.password;
    console.log(result[0][0].result.user_data.password);
    const isMatch = await comparePassword(password, storedPassword);
    console.log(`Password match: ${isMatch}, storedPassword: ${storedPassword}`);
    if (!isMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    let response = {
      success: true,
      message: "Login successful",
      user: {
        id: result[0][0].result.user_data.user_id,
        first_name: result[0][0].result.user_data.first_name,
        middle_name: result[0][0].result.user_data.middle_name,
        last_name: result[0][0].result.user_data.last_name,
        email: result[0][0].result.user_data.email,
        password: result[0][0].result.user_data.password,
        mobile_number: result[0][0].result.user_data.mobile_number,
        user_level: result[0][0].result.user_data.user_level,
      },
    };
    if (!result || result[0][0]["result"].status !== 200) {
      response = {
        success: false,
        message: result[0][0]["result"].message || "Login failed",
      };
    }

    return response;

  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    error.details = error.message;
    throw error;
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

export { loginUser, logoutUser };
