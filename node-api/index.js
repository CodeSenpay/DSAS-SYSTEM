import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import router from "./routes.js";
// import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("welcome", "Hello From WebSocket Server");

  socket.on("message", (data) => {
    console.log("Received Message: ", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
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
