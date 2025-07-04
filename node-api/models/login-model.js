import axios from "axios";
import crypto from "crypto";
import { console } from "inspector";
import pool from "../config/db.conf.js";
import logger from "../middleware/logger.js";
import transporter from "../middleware/mailer.js";
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

async function loginStudent(params, req, res) {
  // Normalize student_id for consistent usage
  const studentId = params.student_id || params.studentId;
  // First, check if the student exists in the local database
  const localResult = await checkStudentExists({
    ...params,
    student_id: studentId,
    studentId: studentId,
  });

  if (localResult.success) {
    // Log successful local login
    await logger(
      {
        action: "login_success",
        user_id: studentId || null,
        details: `Student logged in (local DB): ${studentId}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    // Student exists in local DB, return details
    return {
      success: true,
      message: "Login successful (local database)",
      user: localResult.user || {},
    };
  }

  // Handle invalid credentials or already logged in
  if (
    (!localResult.success && localResult.message === "Invalid credentials.") ||
    localResult.message === "Student is already logged in."
  ) {
    await logger(
      {
        action: "login_error",
        user_id: studentId || null,
        details: `Error checking student existence: ${localResult.error || localResult.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    return {
      success: false,
      message: localResult.message || "Error checking student existence",
      error: localResult.error,
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
    // Log ARMS token failure
    await logger(
      {
        action: "login_error",
        user_id: studentId || null,
        details: `Failed to get ARMS token for student: ${studentId}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
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
        Username: studentId,
        Password: params.password,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.JWToken}`,
          "Secret-Key": tokenResponse.Secret_Key,
          "User-Agent": "Coderstation-Protocol",
        },
      }
    );

    // Check if ARMS API returned a valid student record
    const record = response.data?.Record;
    if (record) {
      // Prepare and insert student details in local DB
      // Deserialize student details as per the required format
      const studentDetails = JSON.parse(JSON.stringify({
        sex: record.Sex,
        major: record.Major,
        college: record.College,
        program: record.Program,
        semester: record.Semester,
        student_id: record.Student_ID,
        year_level: record.Year_Level,
        school_year: record.School_Year,
        student_name: record.Student_Name,
      }));

      const insertResult = await insertStudent({
        student_id: record.Student_ID,
        student_details: studentDetails,
        password: params.password,
      });

      const logAction = insertResult.success
        ? "login_success"
        : "login_partial_success";
      const logDetails = insertResult.success
        ? `Student logged in via ARMS API and inserted locally: ${record.Student_ID}`
        : `Student logged in via ARMS API but failed to insert locally: ${record.Student_ID}`;

      await logger(
        {
          action: logAction,
          user_id: record.Student_ID || null,
          details: logDetails,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        },
        req,
        res
      );

      return insertResult.success
        ? {
          success: true,
          message: "Login successful (ARMS API, student inserted locally)",
          user: insertResult.student || studentDetails,
        }
        : {
          success: false,
          message:
            "Login successful (ARMS API) but failed to insert student locally",
          user: studentDetails,
          error: insertResult.message,
        };
    } else {
      // Log failed ARMS login
      await logger(
        {
          action: "login_attempt",
          user_id: studentId || null,
          details: `Failed ARMS login for student: ${studentId}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
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
  } catch (error) {
    // Log ARMS API error
    await logger(
      {
        action: "login_error",
        user_id: studentId || null,
        details: `Failed to login to ARMS API for student: ${studentId} - ${error.response?.data?.Status || error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
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

async function logoutUser(res) {
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

async function logoutStudent(res) {
  try {
    // Only clear the token cookie and return success
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });
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
    // Hash the password if provided, to match the comparePassword logic
    let hashedPassword = undefined;
    if (params.password) {
      hashedPassword = crypto
        .createHmac("sha256", process.env.SECRET_KEY)
        .update(params.password)
        .digest("hex");
    }

    // Prepare payload (send hashed password if present)
    const payload = JSON.stringify({
      student_id: params.studentId,
      password: hashedPassword,
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
      // If password is provided, compare with stored hash
      if (params.password && user && user.password) {
        const isMatch = await comparePassword(params.password, user.password);
        if (!isMatch) {
          return {
            success: false,
            message: "Invalid credentials",
            user: null,
          };
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

    // Only allow student_details to be inserted if it is a plain object (not a stringified JSON)
    // If it's a string, ignore it and do not include in the payload
    let studentDetailsToInsert = undefined;
    if (
      params.student_details &&
      typeof params.student_details === "object" &&
      !Array.isArray(params.student_details)
    ) {
      studentDetailsToInsert = params.student_details;
    }

    // Build payload without student_details if it's a stringified JSON
    const payloadObj = {
      student_id: params.student_id,
      password: hashedPassword,
    };
    if (studentDetailsToInsert) {
      payloadObj.student_details = studentDetailsToInsert;
    }

    const payload = JSON.stringify(payloadObj);

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
    text: `Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes. If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
        <h2 style="color: #2d7ff9; margin-top: 0;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #333;">Use the following One-Time Password (OTP) to proceed:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d7ff9; margin: 16px 0;">${otp}</div>
        <p style="font-size: 14px; color: #555;">This code will expire in 10 minutes.<br>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 0 0;">
        <p style="font-size: 12px; color: #aaa; margin-top: 16px;">DSAS System</p>
      </div>
    `,
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

async function getUserData(user_id_param) {
  try {
    const [resultSets] = await pool.query(`CALL get_user_data(?)`, [
      user_id_param,
    ]);
    // The SP returns a result set if found, or nothing if not found.
    // If not found, _response is set, but not selected, so resultSets may be empty.
    if (Array.isArray(resultSets) && resultSets.length > 0 && resultSets[0]) {
      // Return the first row of the first result set
      return {
        success: true,
        data: resultSets[0],
      };
    } else {
      // Not found, match the SP's message
      return {
        success: false,
        message: "student not found.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving student data",
      error: error.message,
    };
  }
}

async function disableIsActive(user_id) {
  try {
    const [result] = await pool.query(`CALL disable_is_active(?)`, [user_id]);
    const spResult = result?.[0]?.[0];
    if (spResult && typeof spResult === "object") {
      // If the response is a JSON string, parse it
      let responseObj = spResult;
      if (typeof spResult === "string") {
        try {
          responseObj = JSON.parse(spResult);
        } catch (e) {
          responseObj = { success: false, message: "Invalid SP response" };
        }
      }
      return responseObj;
    } else {
      return { success: false, message: "No response from stored procedure" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error disabling is_active",
      error: error.message,
    };
  }
}

export {
  loginAdmin,
  loginStudent,
  logoutUser,
  logoutStudent,
  sendOtpToEmail,
  verifyOtp,
  getUserData,
  disableIsActive
};
