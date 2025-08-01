import session from 'express-session';

// Session middleware setup
const sessionMiddleware = session({
    secret: 'your-secret-key', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    },
});

// Middleware to check if user is already logged in
function isAlreadyLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        // User is already logged in
        return res.status(200).json({ success: true, message: 'User already logged in.' });
        // Or you can redirect: return res.redirect('/dashboard');
    } else {
        // User is not logged in, proceed to next middleware/route
        return next();
    }
}

export { sessionMiddleware, isAlreadyLoggedIn };