import pool from "../../config/db.conf.js";
import logger from "../../middleware/logger.js";

export class SchedulingModel {
  // ========================================================== Availability Functions ==========================================================
  static async insertAvailability(payload, req, res) {
    // Required fields
    const requiredFields = [
      "transaction_type_id",
      "start_date",
      "end_date",
      "capacity_per_day",
      "created_by",
      "created_at",
      "time_windows",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "insertAvailability",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL insert_availability(?)`, [
        jsondata,
      ]);
      await logger(
        {
          action: "insertAvailability",
          user_id: payload.user_id || null,
          details: "Availability inserted successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger(
        {
          action: "insertAvailability",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

  static async updateAvailability(payload, req, res) {
    // Required fields
    const requiredFields = [
      "availability_id",
      "transaction_id",
      "start_date",
      "end_date",
      "capacity_per_day",
      "user_id",
      "created_at",
      "timewindows",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "updateAvailability",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL update_availability(?)`, [
        jsondata,
      ]);
      await logger(
        {
          action: "updateAvailability",
          user_id: payload.user_id || null,
          details: "Availability updated successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger(
        {
          action: "updateAvailability",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

  static async getAvailability(payload, req, res) {
    let userId = null;
    try {
      // Extract searchkey from payload
      let searchkey = "";
      if (typeof payload === "object" && payload !== null) {
        if ("searchkey" in payload) {
          searchkey = payload.searchkey;
        } else if (Array.isArray(payload) && payload.length > 0) {
          searchkey = payload[0];
        }
        userId = payload.user_id || null;
      } else if (typeof payload === "string") {
        searchkey = payload;
      }

      const [rows] = await pool.query(`CALL get_availability(?)`, [searchkey]);
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  // ========================================================== Appointment Functions ==========================================================
  static async insertAppointment(payload, req, res) {
    // Required fields
    const requiredFields = [
      "transaction_type_id",
      "user_id",
      "appointment_date",
      "time_frame",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "insertAppointment",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL insert_appointment(?)`, [
        jsondata,
      ]);
      await logger(
        {
          action: "insertAppointment",
          user_id: payload.user_id || null,
          details: "Appointment inserted successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger(
        {
          action: "insertAppointment",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

  static async getAppointment(payload, req, res) {
    // Required fields
    const requiredFields = [
      "appointment_id",
      "transaction_title",
      "user_id",
      "appointment_date",
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL get_appointment(?)`, [jsondata]);

      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getTimewindow(payload, req, res) {
    // Required fields
    const requiredFields = ["available_date"];

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

      const [rows] = await pool.query(`CALL get_timewindow(?)`, [jsondata]);

      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async approveAppointment(payload, req, res) {
    // Required fields
    const requiredFields = [
      "appointment_id",
      "user_id",
      "status",
      "date_approved",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "approveAppointment",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL approve_appointment(?)`, [
        jsondata,
      ]);
      await logger(
        {
          action: "approveAppointment",
          user_id: payload.user_id || null,
          details: "Appointment approved successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger(
        {
          action: "approveAppointment",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

  // ========================================================== Transaction Type Functions ==========================================================
  static async insertTransactionType(payload, req, res) {
    // Required fields
    const requiredFields = ["transaction_title", "transaction_detail"];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "insertTransactionType",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL insert_transaction_type(?)`, [
        jsondata,
      ]);
      await logger(
        {
          action: "insertTransactionType",
          user_id: payload.user_id || null,
          details: "Transaction type inserted successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        },
        req,
        res
      );
      return {
        message: "Stored procedure executed successfully",
        result: rows,
        receivedPayload: payload,
      };
    } catch (error) {
      await logger(
        {
          action: "insertTransactionType",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
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

  static async getTransactionType(req, res) {
    try {
      const [rows] = await pool.query(`CALL get_transaction_type()`);

      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
      };
    }
  }
}
