import crypto from "crypto";
import pool from "../config/db.conf.js";
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(payload, req, res) {
    // Required fields
    const requiredFields = [
      "email",
      "password",
      "first_name",
      "last_name",
      "middle_name",
      "mobile_number"
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
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
            const hashedPassword = crypto.createHmac("sha256", secretKey)
                .update(passwordToHash)
                .digest("hex");
            payload.password = hashedPassword;
        } catch (error) {
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

      const [rows] = await pool.query(`CALL register_user(?)`, [
        jsondata,
      ]);
      
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  export { registerUser };
