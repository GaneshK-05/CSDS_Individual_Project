import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import roleMiddleware from "../Middleware/roleMiddleware.js";
import upload from "../Middleware/multerConfig.js";
import {
  submitTask,
  getUserSubmissions,
  getTaskSubmissions,
  getAllSubmissions,
  downloadSubmissionFile
} from "../Controllers/submissionController.js";

const router = express.Router();

// Submit task (text or file)
router.post("/:taskId/submit", authMiddleware, upload.single("file"), submitTask);

// Get user's submissions
router.get("/my", authMiddleware, getUserSubmissions);

// Download submission file
router.get("/download/:submissionId", authMiddleware, downloadSubmissionFile);

// Get all submissions for a task (admin only)
router.get("/task/:taskId", authMiddleware, roleMiddleware("ADMIN"), getTaskSubmissions);

// Get all submissions (admin only)
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getAllSubmissions);

export default router;