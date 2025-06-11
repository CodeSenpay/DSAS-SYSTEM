import { loginModel } from '../models/login-model.js';

async function login(req, res) {
    // Call loginModel and get the result directly
    const data = await loginModel(req.body, req, res);

    // If login is successful and a token is present, set it as a cookie
    if (data && data.token) {
        res.cookie('token', data.token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'lax',
            // secure: true, // Uncomment if using HTTPS
        });
    }

    // Return the token in the response
    return res.json({
        ...data,
        token: data?.token
    });
}

export { login };