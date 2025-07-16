import pool from "../../config/db.conf.js";
import logger from "../../middleware/logger.js";
import { sendEmailToStudent } from "../../middleware/mailer.js";

const getMissingFields = (requiredFields, payload) =>
  requiredFields.filter((field) => !(field in payload));

const getRowsResult = (rows) =>
  rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;

export class SchedulingModel {
  // ========================================================== Availability Functions ==========================================================
  static async insertAvailability(payload) {
    const requiredFields = [
      "transaction_type_id",
      "college",
      "semester",
      "school_year",
      "start_date",
      "end_date",
      "created_by",
      "created_at",
      "time_windows",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      await logger({
        action: "insertAvailability",
        user_id: payload.created_by || null,
        details: `Missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL insert_availability(?)`, [jsondata]);
      await logger({
        action: "insertAvailability",
        user_id: payload.created_by || null,
        details: "Availability inserted successfully",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return getRowsResult(rows);
    } catch (error) {
      await logger({
        action: "insertAvailability",
        user_id: payload.created_by || null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async updateAvailability(payload) {
    const requiredFields = [
      "availability_id",
      "transaction_type_id",
      "college",
      "semester",
      "school_year",
      "start_date",
      "end_date",
      "user_id",
      "time_windows",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      await logger({
        action: "updateAvailability",
        user_id: payload.user_id || null,
        details: `Missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL update_availability(?)`, [jsondata]);
      await logger({
        action: "updateAvailability",
        user_id: payload.user_id || null,
        details: "Availability updated successfully",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return getRowsResult(rows);
    } catch (error) {
      await logger({
        action: "updateAvailability",
        user_id: payload.user_id || null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getAvailability(payload) {
    const { searchkey, college, semester, school_year } = payload || {};
    const spPayload = { searchkey, college, semester, school_year };

    try {
      const jsondata = JSON.stringify(spPayload);
      const [rows] = await pool.query(`CALL get_availability(?)`, [jsondata]);
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async deleteAvailability(payload) {
    const requiredFields = ["availability_id"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const [rows] = await pool.query(
        "CALL delete_availability(?)",
        [payload.availability_id]
      );
      if (rows && Array.isArray(rows) && rows.length > 0) {
        const result = rows[0];
        if (typeof result === "object" && result !== null && "success" in result) {
          return result;
        } else if (typeof result === "string") {
          try {
            return JSON.parse(result);
          } catch (e) {
            return { success: false, message: "Malformed response from stored procedure", raw: result };
          }
        }
        return result;
      }
      return { success: false, message: "No response from stored procedure" };
    } catch (error) {
      return {
        success: false,
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  // ========================================================== Appointment Functions ==========================================================
  static async insertAppointment(payload) {
    const requiredFields = [
      "transaction_type_id",
      "user_id",
      "appointment_date",
      "time_frame",
      "school_year",
      "semester",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL insert_appointment(?)`, [jsondata]);
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getAppointment(payload) {
    const requiredFields = [
      "appointment_id",
      "appointment_status",
      "transaction_type_id",
      "user_id",
      "appointment_date",
      "school_year",
      "semester",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
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
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getTimewindow(payload) {
    const requiredFields = ["available_date"];
    const missingFields = getMissingFields(requiredFields, payload);
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
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async approveAppointment(payload) {
    const requiredFields = [
      "appointment_id",
      "approved_by",
      "appointment_status",
      "student_email",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length) {
      await logger({
        action: "approveAppointment",
        user_id: payload.approved_by ?? null,
        details: `Missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL approve_appointment(?)`, [jsondata]);

      let emailResult = null;
      let spResult = rows?.[0]?.[0]?.result;

      if (spResult?.success && payload.student_email) {
        let transaction_title = spResult?.transaction_type ?? null;
        emailResult = await sendEmailToStudent(
          payload.student_email,
          payload.appointment_status,
          transaction_title
        );
      }

      await logger({
        action: "approveAppointment",
        user_id: payload.approved_by ?? null,
        details: `Appointment ${payload.appointment_status} successfully${emailResult?.message ? `; Email: ${emailResult.message}` : ""}`,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      return Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger({
        action: "approveAppointment",
        user_id: payload.approved_by ?? null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      });
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async deleteAppointment(payload) {
    const requiredFields = ["appointment_id", "user_id"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      await logger({
        action: "deleteAppointment",
        user_id: payload.user_id || null,
        details: `Missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const [rows] = await pool.query(`CALL delete_appointment(?)`, [
        payload.appointment_id,
      ]);
      await logger({
        action: "deleteAppointment",
        user_id: payload.user_id || null,
        details: "Appointment deletion attempted",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      if (rows && Array.isArray(rows) && rows.length > 0 && rows[0].result) {
        try {
          return JSON.parse(rows[0].result);
        } catch {
          return rows[0];
        }
      }
      return getRowsResult(rows);
    } catch (error) {
      await logger({
        action: "deleteAppointment",
        user_id: payload.user_id || null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  // ========================================================== Transaction Type Functions ==========================================================
  static async insertTransactionType(payload) {
    const requiredFields = ["transaction_title", "transaction_detail"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      await logger({
        action: "insertTransactionType",
        user_id: payload.user_id || null,
        details: `Missing required fields: ${missingFields.join(", ")}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL insert_transaction_type(?)`, [jsondata]);
      await logger({
        action: "insertTransactionType",
        user_id: payload.user_id || null,
        details: "Transaction type inserted successfully",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Stored procedure executed successfully",
        result: rows,
        receivedPayload: payload,
      };
    } catch (error) {
      await logger({
        action: "insertTransactionType",
        user_id: payload.user_id || null,
        details: `Stored procedure execution failed: ${error.message}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getTransactionType() {
    try {
      const [rows] = await pool.query(`CALL get_transaction_type()`);
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
      };
    }
  }

  static async getCollegeDeparments() {
    try {
      const [rows] = await pool.query("SELECT * FROM college_departments");
      return rows && Array.isArray(rows) && rows.length > 0 ? rows : rows;
    } catch (err) {
      return {
        message: "Fetching of College Departments Failed!",
        error: err.message,
      };
    }
  }

  static async updateStudentEmail(payload) {
    const requiredFields = ["student_id", "student_email"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL update_student_email(?)`, [jsondata]);
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  // static async uploadProfile(payload) {
  //   const requiredFields = ["student_id", "student_profile"];
  //   const missingFields = getMissingFields(requiredFields, payload);
  //   if (missingFields.length > 0) {
  //     return {
  //       message: "Missing required fields",
  //       missingFields,
  //       receivedPayload: payload,
  //     };
  //   }
  //   try {
  //     const jsondata = JSON.stringify(payload);
  //     const [rows] = await pool.query(`CALL upload_student_profile(?)`, [jsondata]);
  //     return getRowsResult(rows);
  //   } catch (error) {
  //     return {
  //       message: "Stored procedure execution failed",
  //       error: error.message,
  //       receivedPayload: payload,
  //     };
  //   }
  // }

  // static async getStudentProfile(payload) {
  //   const requiredFields = ["student_id"];
  //   const missingFields = getMissingFields(requiredFields, payload);
  //   if (missingFields.length > 0) {
  //     return {
  //       message: "Missing required fields",
  //       missingFields,
  //       receivedPayload: payload,
  //     };
  //   }
  //   try {
  //     const [rows] = await pool.query(`CALL get_student_profile(?)`, [payload]);
  //     if (rows && Array.isArray(rows) && rows.length > 0) {
  //       const profileResult = rows[0] && rows[0][0] && rows[0][0].student_profile
  //         ? { student_profile: rows[0][0].student_profile }
  //         : null;
  //       const responseResult = rows[1] && rows[1][0] && rows[1][0].Response
  //         ? JSON.parse(rows[1][0].Response)
  //         : null;
  //       if (profileResult) {
  //         return { success: true, ...profileResult };
  //       } else if (responseResult) {
  //         return responseResult;
  //       }
  //     }
  //     return { success: false, message: "Unexpected response from stored procedure." };
  //   } catch (error) {
  //     return {
  //       message: "Stored procedure execution failed",
  //       error: error.message,
  //       receivedPayload: payload,
  //     };
  //   }
  // }

  static async generateReport(payload) {
    const requiredFields = [
      "transaction_type_id",
      "date",
      "school_year",
      "semester",
      "status",
    ];

    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      const [rows] = await pool.query(`CALL generate_report(?)`, [jsondata]);
      return getRowsResult(rows);
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  // ========================================================== Fetching Section ====================================================================
  static async fetchTotalSlots(payload) {
    const requiredFields = ["transaction_type_id"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const [rows] = await pool.query('CALL get_total_slots(?)', [payload.transaction_type_id]);
      return getRowsResult(rows);
    } catch (err) {
      return {
        message: "Fetching total slots failed!",
        error: err.message,
      };
    }
  }

  static async fetchTotalPendings(payload) {
    const requiredFields = ["transaction_type_id"];
    const missingFields = getMissingFields(requiredFields, payload);
    if (missingFields.length > 0) {
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const [rows] = await pool.query('CALL get_total_pending(?)', [payload.transaction_type_id]);
      return getRowsResult(rows);
    } catch (err) {
      return {
        message: "Fetching total pendings failed",
        error: err.message,
      };
    }
  }
}
