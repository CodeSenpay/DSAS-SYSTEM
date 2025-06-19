// Simple authentication middleware for user auth

function userAuthMiddleware(req, res, next) {
  // Example: Check for an Authorization header (e.g., Bearer token)
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided" });
  }

  // For demonstration, let's just check if the token is "valid-token"
  // In production, verify JWT or session, etc.
  // Try to get token from Authorization header or from cookies (client browser)
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token !== "valid-token") {
    return res.status(403).json({ error: "Invalid or missing token" });
  }

  // If valid, proceed to next middleware/handler
  next();
}

export { userAuthMiddleware };
