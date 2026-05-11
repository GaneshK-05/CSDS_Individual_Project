import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './config/database.js';

import authRouter from './Routers/authRouter.js';
import adminRouter from './Routers/adminRouter.js';
import submissionRouter from './Routers/submissionRouter.js';

dotenv.config();
const port = process.env.PORT || 10000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "server is running", port });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/submission", submissionRouter);

app.listen(port, () => {
  connectDB();
  console.log("your server is running in port", port);
});
