import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowed = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowed.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('CORS blocked by origin'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
