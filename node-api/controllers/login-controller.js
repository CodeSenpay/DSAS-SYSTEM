async function login(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.json({ success: false, message: "No Data has given." });
  } else {
    try {
      // const data = await loginModel(req.body);

      res.json(req.body);
      // if (data && data.token) {
      //   res.cookie("token", data.token, {
      //     httpOnly: true,
      //     maxAge: 24 * 60 * 60 * 1000, // 1 day
      //     sameSite: "lax",
      //   });
      // }

      // if (res.headersSent) {
      //   return;
      // }

      // return res.json({
      //   ...data,
      //   token: data?.token,
      // });
    } catch (error) {
      console.error("Login error:", error);

      // if (!res.headersSent) {
      //   return res.status(500).json({ error: "Internal server error" });
      // }
    }
  }
}

export { login };
