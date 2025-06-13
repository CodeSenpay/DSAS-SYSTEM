import pool from '../../config/db.conf.js';

async function addSchedule(payload, req, res) {
    try {
        const jsondata = JSON.stringify(payload);

        const [rows] = await pool.query(`CALL update_availability(?)`, [jsondata]);
        // The result from a CALL is usually an array of arrays; return the first result set
        return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
        return {
            message: "Stored procedure execution failed",
            error: error.message,
            receivedPayload: payload
        };
    }
}
async function addTransaction(payload, req, res) {
    try {

        const jsondata = JSON.stringify(payload);

        const [rows] = await pool.query(`CALL update_transaction(?)`, [jsondata]);
        return {
            message: "Stored procedure executed successfully",
            result: rows,
            receivedPayload: payload
        };
    } catch (error) {
        return {
            message: "Stored procedure execution failed",
            error: error.message,
            receivedPayload: payload
        };
    }
}

async function getTransaction(payload, req, res) {
    try {
        // Extract searchkey from payload
        let searchkey = '';
        if (typeof payload === 'object' && payload !== null) {
            if ('searchkey' in payload) {
                searchkey = payload.searchkey;
            } else if (Array.isArray(payload) && payload.length > 0) {
                searchkey = payload[0];
            }
        } else if (typeof payload === 'string') {
            searchkey = payload;
        }

        const [rows] = await pool.query(`CALL get_availability(?)`, [searchkey]);
        // The result from a CALL is usually an array of arrays; return the first result set
        return rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    } catch (error) {
        return {
            message: "Stored procedure execution failed",
            error: error.message,
            receivedPayload: payload
        };
    }
}

export { addSchedule, getTransaction };
