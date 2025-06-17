import pool from '../../config/db.conf.js';

async function insert_availability(payload, req, res) {
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
    const missingFields = requiredFields.filter(field => !(field in payload));
    if (missingFields.length > 0) {
        return {
            message: "Missing required fields",
            missingFields,
            receivedPayload: payload
        };
    }

    try {
        const jsondata = JSON.stringify(payload);
        console.log(payload);

        const [rows] = await pool.query(`CALL insert_availability(?)`, [jsondata]);
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
async function update_availability(payload, req, res) {
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
    const missingFields = requiredFields.filter(field => !(field in payload));
    if (missingFields.length > 0) {
        return {
            message: "Missing required fields",
            missingFields,
            receivedPayload: payload
        };
    }

    try {
        const jsondata = JSON.stringify(payload);
        console.log(payload);

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

async function getAvailability(payload, req, res) {
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

async function getAppointment(payload, req, res) {
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

        const [rows] = await pool.query(`CALL get_appointment(?)`, [searchkey]);
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



export { insert_availability, update_availability, getAvailability, getAppointment };
