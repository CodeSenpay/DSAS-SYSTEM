import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.cookies.token;
  console.log("Token from cookie:", token);
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.clearCookie("jwt");
    return res.sendStatus(403);
  }
}
