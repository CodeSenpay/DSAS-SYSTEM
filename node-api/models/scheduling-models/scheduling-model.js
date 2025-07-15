import pool from "../../config/db.conf.js";
import logger from "../../middleware/logger.js";
import { sendEmailToStudent } from "../../middleware/mailer.js";

export class SchedulingModel {
  // ========================================================== Availability Functions ==========================================================
  static async insertAvailability(payload) {
    // Required fields
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

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
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

      const [rows] = await pool.query(`CALL insert_availability(?)`, [
        jsondata,
      ]);
      await logger({
        action: "insertAvailability",
        user_id: payload.created_by || null,
        details: "Availability inserted successfully",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
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
    // Required fields
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

    // console.log("Update availability: ", payload);
    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
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

      const [rows] = await pool.query(`CALL update_availability(?)`, [
        jsondata,
      ]);

      await logger({
        action: "updateAvailability",
        user_id: payload.user_id || null,
        details: "Availability updated successfully",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
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

    // Compose the flat object for the SP
    const spPayload = {
      searchkey,
      college,
      semester,
      school_year,
    };

    try {
      const jsondata = JSON.stringify(spPayload);
      const [rows] = await pool.query(`CALL get_availability(?)`, [jsondata]);
      // console.log(rows);
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
  static async insertAppointment(payload) {
    // Required fields
    const requiredFields = [
      "transaction_type_id",
      "user_id",
      "appointment_date",
      "time_frame",
      "school_year",
      "semester",
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

      const [rows] = await pool.query(`CALL insert_appointment(?)`, [jsondata]);
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getAppointment(payload) {
    // Required fields
    const requiredFields = [
      "appointment_id",
      "appointment_status",
      "transaction_type_id",
      "user_id",
      "appointment_date",
      "school_year",
      "semester",
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

  static async getTimewindow(payload) {
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

  static async approveAppointment(payload) {
    const requiredFields = [
      "appointment_id",
      "approved_by",
      "appointment_status",
      "student_email",
    ];

    const missingFields = requiredFields.filter((field) => !(field in payload));
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
      const [rows] = await pool.query(`CALL approve_appointment(?)`, [
        jsondata,
      ]);

      let emailResult = null;
      // Only send the email if the stored procedure call is successful
      // We'll define "success" as the presence of a result field in the first row, and (optionally) a success property in the parsed result
      let spResult = rows?.[0]?.[0]?.result;

      if (spResult.success && payload.student_email) {
        // console.log("Transaction type: ", spResult?.transaction_type)
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
    // Required field
    const requiredFields = ["appointment_id", "user_id"];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
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
      // The stored procedure returns a result set with a single row containing a 'result' field (JSON string)
      if (rows && Array.isArray(rows) && rows.length > 0 && rows[0].result) {
        try {
          return JSON.parse(rows[0].result);
        } catch {
          return rows[0];
        }
      }
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
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
    // Required fields
    const requiredFields = ["transaction_title", "transaction_detail"];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
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

      const [rows] = await pool.query(`CALL insert_transaction_type(?)`, [
        jsondata,
      ]);
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

      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
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
    // Required fields
    const requiredFields = ["student_id", "student_email"];

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

      const [rows] = await pool.query(`CALL update_student_email(?)`, [
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

  // static async uploadProfile(payload) {
  //   // Required fields
  //   const requiredFields = ["student_id", "student_profile"];

  //   // Check for missing fields
  //   const missingFields = requiredFields.filter((field) => !(field in payload));
  //   if (missingFields.length > 0) {
  //     return {
  //       message: "Missing required fields",
  //       missingFields,
  //       receivedPayload: payload,
  //     };
  //   }

  //   try {
  //     const jsondata = JSON.stringify(payload);
  //     const [rows] = await pool.query(`CALL upload_student_profile(?)`, [
  //       jsondata,
  //     ]);
  //     return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
  //   } catch (error) {
  //     return {
  //       message: "Stored procedure execution failed",
  //       error: error.message,
  //       receivedPayload: payload,
  //     };
  //   }
  // }

  // static async getStudentProfile(payload) {
  //   // Required field
  //   const requiredFields = ["student_id"];

  //   // Check for missing fields
  //   const missingFields = requiredFields.filter((field) => !(field in payload));
  //   if (missingFields.length > 0) {
  //     return {
  //       message: "Missing required fields",
  //       missingFields,
  //       receivedPayload: payload,
  //     };
  //   }

  //   try {
  //     // const jsondata = JSON.stringify(payload);
  //     const [rows] = await pool.query(`CALL get_student_profile(?)`, [payload]);
  //     // The SP returns two result sets: the profile (if found) and the response JSON
  //     // Find the student_profile if present, otherwise return the response
  //     if (rows && Array.isArray(rows) && rows.length > 0) {
  //       // rows[0] is the first result set (student_profile if found)
  //       // rows[1] is the second result set (response JSON)
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
  //     // Fallback
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
      const [rows] = await pool.query(`CALL generate_report(?)`, [jsondata]);
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
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
    // Required fields
    const requiredFields = ["transaction_type_id"];

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
      const [rows] = await pool.query('CALL get_total_slots(?)', [payload.transaction_type_id]);
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (err) {
      return {
        message: "Fetching total slots failed!",
        error: err.message,
      };
    }
  }

  static async fetchTotalPendings(payload) {
    // Required fields
    const requiredFields = ["transaction_type_id"];

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
      const [rows] = await pool.query('CALL get_total_pending(?)', [payload.transaction_type_id]);
      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (err) {
      return {
        message: "Fetching total pendings failed",
        error: err.message,
      };
    }
  }
}
