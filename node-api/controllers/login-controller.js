import { loginModel } from "../models/login-model.js";

async function login(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.json({ success: false, message: "No Data has given." });
  } else {
    try {
      const response = await loginModel(req.body);
      res.json(response);
    } catch (error) {
      console.error("Login error:", error);

      // if (!res.headersSent) {
      //   return res.status(500).json({ error: "Internal server error" });
      // }
    }
  }
}

export { login };
