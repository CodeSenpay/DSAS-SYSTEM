import pool from "../config/db.conf.js";

const JWT_SECRET = process.env.JWT_SECRET; // In production, use env variable

// The model should NOT use req or res. It should only return data or throw errors.
async function loginModel(payload) {
  try {
    const sql = `CALL login_user(?)`;

    // The result of a CALL is an array: [ [rows], ... ]
    const [result] = await pool.query(sql, [payload.email]);

    return result;
    // The SP returns a user row if valid, otherwise empty
    // const user = result && result[0] && result[0][0];

    // if (!user) {
    //   // Instead of using res, throw an error to be handled by the controller
    //   const error = new Error("Invalid credentials or user not found");
    //   error.status = 401;
    //   throw error;
    // }

    // // Generate JWT token
    // const tokenPayload = {
    //   id: user.user_id,
    //   username: user.user_name,
    //   email: user.email,
    // };
    // const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

    // // Return the data (controller will handle the response)
    // return {
    //   message: "Login successful",
    //   token,
    //   user: tokenPayload,
    // };
  } catch (error) {
    // Attach a status if not present (for controller to handle)
    if (!error.status) {
      error.status = 500;
    }
    error.details = error.message;
    throw error;
  }
}

export { loginModel };
