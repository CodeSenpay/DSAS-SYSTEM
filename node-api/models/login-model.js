import pool from "../config/db.conf.js";
import crypto from "crypto";
import transporter from "../middleware/mailer.js";
import { console } from "inspector";
import logger from "../middleware/logger.js";
import axios from "axios";
import { Console } from "console";
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

// Sample loginArmsAPI function returning a sample login response from an API(Include user details in sending to the sp)
async function loginStudent(params, req, res) {
  // First, check if the student exists in the local database
  const localResult = await checkStudentExists(params);

  if (localResult.success) {
    // Student exists in local DB, return details
    return {
      success: true,
      message: "Login successful (local database)",
      user: localResult.user || {}, // Attach user details if available
    };
  }

  // If not found locally, get the ARMS token
  const tokenResponse = await registerToArmsToken();

  if (
    !tokenResponse ||
    typeof tokenResponse !== "object" ||
    !tokenResponse.JWToken ||
    !tokenResponse.Secret_Key
  ) {
    return {
      success: false,
      message: tokenResponse?.Status || "Failed to get ARMS token",
      error: tokenResponse?.error || null,
    };
  }

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
          authorization: `Bearer ${tokenResponse.JWToken}`,
        },
      }
    );

    // Check if ARMS API returned a valid student record
    const record = response.data?.Record;
    if (record) {
      // Prepare student details for local DB
      const studentDetails = {
        sex: record.Sex,
        major: record.Major,
        college: record.College,
        program: record.Program,
        semester: record.Semester,
        student_id: record.Student_ID,
        year_level: record.Year_Level,
        school_year: record.School_Year,
        student_name: record.Student_Name,
        status: response.data.Status,
      };

      // Insert student into local DB using data from ARMS API
      const insertParams = {
        student_id: record.Student_ID,
        student_details: studentDetails,
        password: params.password,
      };
      const insertResult = await insertStudent(insertParams);

      if (insertResult.success) {
        return {
          success: true,
          message: "Login successful (ARMS API, student inserted locally)",
          user: insertResult.student || studentDetails,
        };
      } else {
        return {
          success: insertResult,
          message:
            "Login successful (ARMS API) but failed to insert student locally",
          user: studentDetails,
          error: insertResult.message,
        };
      }
    } else {
      return {
        success: false,
        message: response.data?.Status || "Login failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to login to ARMS API",
      error: error.response?.data?.Status || error.message,
    };
  }
}

async function registerToArmsToken() {
  const key = process.env.API_KEY;
  const secret = process.env.API_SECRET;
  const agent = process.env.USER_AGENT;
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
          "User-Agent": agent,
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

// Checks if a student exists in the local database, inserts if not, and returns student info
async function checkStudentExists(params) {
  try {
    const payload = JSON.stringify({
      student_id: params.student_id,
      password: params.password || null, // Include password if needed by SP
    });
    const [result] = await pool.query(`CALL check_student(?)`, [payload]);
    const spResult = result?.[0]?.[0]?.Response;

    if (spResult && spResult.success) {
      // Parse student_details if it's a string
      let user = spResult.student;
      if (user && typeof user.student_details === "string") {
        try {
          user.student_details = JSON.parse(user.student_details);
        } catch (e) {
          // leave as string if parsing fails
        }
      }
      return {
        success: true,
        message: spResult.message,
        user,
      };
    } else {
      return {
        success: false,
        message:
          spResult?.message || "Student does not exist in local database",
        user: spResult?.student || null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error checking student existence",
      error: error.message,
    };
  }
}

async function insertStudent(params) {
  try {
    // Hash the password before storing
    const hashedPassword = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(params.password)
      .digest("hex");

    // Ensure student_details is a stringified JSON (as expected by the SP)
    const studentDetailsString =
      typeof params.student_details === "string"
        ? params.student_details
        : JSON.stringify(params.student_details);

    const payload = JSON.stringify({
      student_id: params.student_id,
      student_details: studentDetailsString,
      password: hashedPassword,
    });
    const [result] = await pool.query(`CALL insert_student(?)`, [payload]);
    const spResult = result?.[0]?.[0]?.Response;

    if (spResult && spResult.success) {
      // Parse student_details if it's a stringified JSON
      let student = spResult.student;
      if (student && typeof student.student_details === "string") {
        try {
          student.student_details = JSON.parse(student.student_details);
        } catch (e) {
          // leave as string if parsing fails
        }
      }
      return {
        success: true,
        message: spResult.message,
        student,
      };
    } else {
      return {
        success: false,
        message: spResult?.message || "Failed to insert student",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error inserting student",
      error: error.message,
    };
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
