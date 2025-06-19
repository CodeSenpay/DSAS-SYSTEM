const JWT_SECRET = process.env.JWT_SECRET;
import pool from "../config/db.conf.js";

async function loginModel(data) {
  try {
    const { email } = data;
    console.log(`email: ${email}`);
    const [result] = await pool.query(`CALL login_user(?)`, [
      JSON.stringify({ email }),
    ]);

    console.log("Result from stored procedure:", result[0]);

    if (!result || result.length === 0) {
      const error = new Error("Invalid credentials or user not found");
      error.status = 401;
      throw error;
    }

    // Return the user data (no JWT generation)
    return {
      success: true,
      message: "Login successful",
      user: {
        id: result[0][0].user_id,
        username: result[0][0].username,
        email: result[0][0].email,
        user_level: result[0][0].user_level,
      },
    };
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    error.details = error.message;
    throw error;
  }
}

export { loginModel };
