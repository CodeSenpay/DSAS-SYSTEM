import pool from "../../config/db.conf.js";

export class SchedulingModel {
    
    // ========================================================== Availability Functions ==========================================================
    static async insertAvailability(payload, req, res) {
        // Required fields
        const requiredFields = [
            'transaction_id',
            'start_date',
            'end_date',
            'capacity_per_day',
            'created_by',
            'created_at',
            'timewindows',
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
      console.log(payload);

      const [rows] = await pool.query(`CALL insert_availability(?)`, [
        jsondata,
      ]);
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

    static async updateAvailability(payload, req, res) {
        // Required fields
        const requiredFields = [
            'availability_id',
            'transaction_id',
            'start_date',
            'end_date',
            'capacity_per_day',
            'created_by',
            'created_at',
            'timewindows',
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
      console.log(payload);

      const [rows] = await pool.query(`CALL update_availability(?)`, [
        jsondata,
      ]);
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

  static async getAvailability(payload, req, res) {
    try {
      // Extract searchkey from payload
      let searchkey = "";
      if (typeof payload === "object" && payload !== null) {
        if ("searchkey" in payload) {
          searchkey = payload.searchkey;
        } else if (Array.isArray(payload) && payload.length > 0) {
          searchkey = payload[0];
        }
      } else if (typeof payload === "string") {
        searchkey = payload;
      }

      const [rows] = await pool.query(`CALL get_availability(?)`, [searchkey]);
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

    // ========================================================== Appointment Functions ==========================================================
   static async insertAppointment(payload, req, res) {
        // Required fields
        const requiredFields = [
            'appointment_id',
            'transaction_type_id',
            'user_id',
            'appointment_date',
            'time_window_id',
            'created_at',
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
      console.log(payload);

      const [rows] = await pool.query(`CALL insert_availability(?)`, [
        jsondata,
      ]);
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

  static async getAppointment(payload, req, res) {
     // Required fields
        const requiredFields = [
            'appointment_id',
            'transaction_title',
            'user_id',
            'appointment_date',
            
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
      console.log(payload);

      const [rows] = await pool.query(`CALL get_appointment(?)`, [
        jsondata,
      ]);
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
      return {
        message: "Missing required fields",
        missingFields,
        receivedPayload: payload,
      };
    }

    try {
      const jsondata = JSON.stringify(payload);
      console.log(payload);

      const [rows] = await pool.query(`CALL approve_appointment(?)`, [
        jsondata,
      ]);
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

    // ========================================================== Transaction Type Functions ==========================================================
    static async insertTransactionType(payload, req, res) {
        // Required fields
        const requiredFields = [
            'transaction_title',
            'transaction_detail',
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

        const [rows] = await pool.query(`CALL insert_transaction_type(?)`, [
            jsondata,
        ]);
        return {
            message: "Stored procedure executed successfully",
            result: rows,
            receivedPayload: payload,
        };
        } catch (error) {
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
            // The result from a CALL is usually an array of arrays; return the first result set
            return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
        } catch (error) {
            return {
                message: "Stored procedure execution failed",
                error: error.message
            };
        }

    }
  }

