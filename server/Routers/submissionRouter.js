import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { submitEntry, mySubmissions } from "../Controllers/submissionController.js";

const router = express.Router();

router.post("/", authMiddleware, submitEntry);
router.get("/my", authMiddleware, mySubmissions);

export default router;