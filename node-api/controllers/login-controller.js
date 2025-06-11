import { loginModel } from '../models/login-model.js';

async function login(req, res) {
    try {
        // Call loginModel and get the result directly
        // Do NOT pass res to the model, only req.body
        const data = await loginModel(req.body);

        // If login is successful and a token is present, set it as a cookie
        if (data && data.token) {
            res.cookie('token', data.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                sameSite: 'lax',
                // secure: true, // Uncomment if using HTTPS
            });
        }

        // Ensure headers are not already sent before sending a response
        if (res.headersSent) {
            // If headers are already sent, do not attempt to send another response
            return;
        }

        // Return the token and other data in the response
        // Avoid sending req or res or any Express objects
        return res.json({
            ...data,
            token: data?.token
        });
    } catch (error) {
        // Handle error and send a proper response
        console.error('Login error:', error);

        // Ensure headers are not already sent before sending an error response
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        // If headers are already sent, do nothing
    }
}

export { login };