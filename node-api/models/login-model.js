import pool from '../config/db.conf.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // In production, use env variable

async function loginModel(payload, req, res) {
    try {
        // The stored procedure name is fixed as 'login'
        const sp_name = payload.sp_name;

        // The stored procedure expects a single JSON parameter named 'jsondata'
        // We'll pass the payload as JSON string
        const jsondata = JSON.stringify(payload.payload || {});

        // Call the stored procedure: CALL login(?)
        const sql = `CALL ${sp_name}(?)`;

        // The result of a CALL is an array: [ [rows], ... ]
        const [result] = await pool.query(sql, [jsondata]);

        // The SP returns a user row if valid, otherwise empty
        const user = result && result[0] && result[0][0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials or user not found' });
        }

        // Generate JWT token
        const tokenPayload = {
            id: user.user_id,
            username: user.user_name,
            email: user.email
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: tokenPayload
        });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed', details: error.message });
    }
}

export { loginModel };
