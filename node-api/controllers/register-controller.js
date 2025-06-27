import { registerUser } from "../models/register-model.js";

async function register(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided." });
  }

  try {
    const response = await registerUser(req.body);
    // console.log("Register Controller response:", response);

    return res.json(response[0].response_json);
  } catch (error) {
    console.error("Login error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
export { register };
