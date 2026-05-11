import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from './config/database.js';

import authRouter from './Routers/authRouter.js';
import adminRouter from './Routers/adminRouter.js';
import submissionRouter from './Routers/submissionRouter.js';
import taskRouter from './Routers/taskRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT || 10000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "server is running", port });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/tasks", taskRouter);

app.listen(port, () => {
  connectDB();
  console.log("your server is running in port", port);
});
