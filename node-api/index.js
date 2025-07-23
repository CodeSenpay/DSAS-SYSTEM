import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import router from "./routes.js";
// import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.ORIGIN_URL, methods: ["GET", "POST"] },
});

app.use(express.json());

const allowed = [process.env.URL_2, process.env.URL_1, process.env.URL_3];


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked by origin'));
    }
  },
  credentials: true, // if you use cookies/sessions
};
app.use(cors(corsOptions));
app.use(express.json());
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
