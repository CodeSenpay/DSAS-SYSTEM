import pool from '../../config/db.conf.js';

async function schedulingModel(payload, req, res) {
    try {
        // For mysql2, .query returns [rows, fields]
        const [rows] = await pool.query('SELECT * FROM users_tbl');
        return {
            message: "Fetched users successfully",
            users: rows,
            receivedPayload: payload
        };
    } catch (error) {
        return {
            message: "Database query failed",
            error: error.message,
            receivedPayload: payload
        };
    }
}

export { schedulingModel };
