import pool from "../../config/db.conf.js";
import logger from "../../middleware/logger.js";
import transporter from "../../middleware/mailer.js";
import { sendOtpToEmail } from "../login-model.js";

export class SchedulingModel {
  // ========================================================== Availability Functions ==========================================================
  static async insertAvailability(payload) {
    // Required fields
    const requiredFields = [
      "transaction_type_id",
      "start_date",
      "end_date",
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
        }
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
        }
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
        }
      );
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
      "start_date",
      "end_date",
      "user_id",
      "time_windows",
    ];

    console.log("Update availability: ", payload);
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
        }
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
        }
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
        }
      );
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }

  static async getAvailability(payload) {
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
  static async insertAppointment(payload) {
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
        }
      );
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);

      const [rows] = await pool.query(`CALL insert_appointment(?)`, [jsondata]);
      await logger(
        {
          action: "insertAppointment",
          user_id: payload.user_id || null,
          details: "Appointment inserted successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
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
        }
      );
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

  // Fix: Make sendEmailToStudent a non-static method so it can be called as this.sendEmailToStudent
  async sendEmailToStudent(payload) {
    // This function sends an email to the student using the mailer.js transporter.
    // Required fields: student_email, subject, message
    const requiredFields = ["student_email", "subject", "message"];
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "sendEmailToStudent",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: payload.student_email,
      subject: payload.subject,
      text: payload.message,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
        <h2 style="color: #2d7ff9; margin-top: 0;">${payload.subject}</h2>
        <p style="font-size: 16px; color: #333;">${payload.message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 0 0;">
        <p style="font-size: 12px; color: #aaa; margin-top: 16px;">DSAS System</p>
      </div>
    `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      await logger(
        {
          action: "sendEmailToStudent",
          user_id: payload.user_id || null,
          details: `Email sent to ${payload.student_email}: ${info.response}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
      return {
        success: true,
        message: `Email sent to ${payload.student_email}`,
        info: info.response,
      };
    } catch (error) {
      await logger(
        {
          action: "sendEmailToStudent",
          user_id: payload.user_id || null,
          details: `Failed to send email: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
      return {
        success: false,
        message: "Failed to send email",
        error: error.message,
      };
    }
  }

  static async approveAppointment(payload) {
    // Required fields
    const requiredFields = ["appointment_id", "user_id", "appointment_status", "student_email"];

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
        }
      );
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);

      // Wait for the stored procedure to finish and get the result
      const [rows] = await pool.query(`CALL approve_appointment(?)`, [
        jsondata,
      ]);

      // Only after the SP finishes, send the email (if student_email is present)
      let emailResult = null;
      if (payload.student_email) {
        // Use the sendEmailToStudent method with hardcoded subject and message
        emailResult = await this.prototype.sendEmailToStudent(
          {
            student_email: payload.student_email,
            subject: "Appointment Status Update",
            message: "Your appointment status has been updated. Please check your account for more details.",
          },
        );
      }

      await logger(
        {
          action: "approveAppointment",
          user_id: payload.user_id || null,
          details: "Appointment approved successfully" + (emailResult && emailResult.message ? `; Email: ${emailResult.message}` : ""),
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
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
        }
      );
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
      await logger(
        {
          action: "deleteAppointment",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
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
      await logger(
        {
          action: "deleteAppointment",
          user_id: payload.user_id || null,
          details: "Appointment deletion attempted",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
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
      await logger(
        {
          action: "deleteAppointment",
          user_id: payload.user_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
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
      await logger(
        {
          action: "insertTransactionType",
          user_id: payload.user_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
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
        }
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
        }
      );
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

  static async updateStudentEmail(payload) {
    // Required fields
    const requiredFields = ["student_id", "student_email"];

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
      await logger(
        {
          action: "updateStudentEmail",
          user_id: payload.student_id || null,
          details: `Missing required fields: ${missingFields.join(", ")}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
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

      await logger(
        {
          action: "updateStudentEmail",
          user_id: payload.student_id || null,
          details: "Student email updated/inserted successfully",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );

      return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
      await logger(
        {
          action: "updateStudentEmail",
          user_id: payload.student_id || null,
          details: `Stored procedure execution failed: ${error.message}`,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }
      );
      return {
        message: "Stored procedure execution failed",
        error: error.message,
        receivedPayload: payload,
      };
    }
  }
}
