import pool from "../config/db.conf.js";

async function logger(payload, req, res) {
  // Required fields
  const requiredFields = ["action", "user_id", "details", "timestamp"];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !(field in payload));
  if (missingFields.length > 0) {
    return {
      message: "Missing required fields",
      missingFields,
      receivedPayload: payload,
    };
  }

  try {
    const jsondata = JSON.stringify(payload);

    const [rows] = await pool.query(`CALL insert_log_entry(?)`, [jsondata]);
    // The result from a CALL is usually an array of arrays; return the first result set
    return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
  } catch (error) {
    return {
      message: "Stored procedure execution failed",
      error: error.message,
      receivedPayload: payload,
    };
  }
}

export default logger;
