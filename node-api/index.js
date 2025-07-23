import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import router from "./routes.js";
// import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.ORIGIN_URL, methods: ["GET", "POST"] },
});

app.use(express.json());

const allowed = [process.env.URL_2, process.env.URL_1];

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

app.use("/", router);

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("registerUser", (userId) => {
    socket.join(userId?.toString());
    console.log(`User joined their Room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
