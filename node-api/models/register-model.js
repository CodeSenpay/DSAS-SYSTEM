import crypto from "crypto";
import pool from "../config/db.conf.js";
import logger from "../middleware/logger.js";
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(payload, req, res) {
  // Required fields
  const requiredFields = [
    "email",
    "password",
    "first_name",
    "last_name",
    "middle_name",
    "mobile_number",
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !(field in payload));
  if (missingFields.length > 0) {
    // Log missing fields
    await logger(
      {
        action: "register_attempt",
        user_id: payload.email || null,
        details: `Registration failed: missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    return {
      message: "Missing required fields",
      missingFields,
      receivedPayload: payload,
    };
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    // Log invalid email format
    await logger(
      {
        action: "register_attempt",
        user_id: payload.email || null,
        details: `Registration failed: invalid email format (${payload.email})`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    return {
      message: "Invalid email format",
      receivedEmail: payload.email,
    };
  }

  let hashedPassword;

  if (payload.password) {
    try {
      const secretKey = process.env.SECRET_KEY;
      // Ensure the password is a string before hashing
      const passwordToHash = String(payload.password);
      const hashedPassword = crypto
        .createHmac("sha256", secretKey)
        .update(passwordToHash)
        .digest("hex");
      payload.password = hashedPassword;
    } catch (error) {
      // Log password hashing failure
      await logger(
        {
          action: "register_error",
          user_id: payload.email || null,
          details: `Password hashing failed: ${error.message}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        },
        req,
        res
      );
      return {
        message: "Password hashing failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }
  // console.log("Payload before DB call:", payload);
  try {
    const jsondata = JSON.stringify(payload);

    const [rows] = await pool.query(`CALL register_user(?)`, [jsondata]);

    // Log successful registration attempt (regardless of DB result)
    await logger(
      {
        action: "register_success",
        user_id: payload.email || null,
        details: `User registration attempted via API`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );

    return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
  } catch (error) {
    // Log DB error
    await logger(
      {
        action: "register_error",
        user_id: payload.email || null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
      req,
      res
    );
    return {
      message: "Stored procedure execution failed",
      error: error.message,
      receivedPayload: payload,
    };
  }
}

export { registerUser };
