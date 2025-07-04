import cors from "cors";
import express from "express";
import router from "./routes.js";
// import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

const allowed = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("CORS blocked by origin"));
      }
    },
    credentials: true,
  })
);

// Define the rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 50, // Limit each IP to 50 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });

// // Apply the rate limiter to all requests
// app.use(limiter);

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
