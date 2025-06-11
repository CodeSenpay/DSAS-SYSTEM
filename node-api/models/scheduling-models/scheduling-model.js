import pool from '../../config/db.conf.js';

async function schedulingModel(payload, req, res) {
    // Example: Use the database connection from db.conf.js
    try {
        // Fetch all users from the users table
        const result = await pool.query('SELECT * FROM "Users"');
        return {
            message: "Fetched users successfully",
            users: result.rows,
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
