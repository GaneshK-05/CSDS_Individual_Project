import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import roleMiddleware from "../Middleware/roleMiddleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from "../Controllers/taskController.js";

const router = express.Router();

// Get all tasks
router.get("/", getAllTasks);

// Get task stats (for admin analytics)
router.get("/stats", authMiddleware, roleMiddleware("ADMIN"), getTaskStats);

// Get specific task
router.get("/:id", getTaskById);

// Create task (admin only)
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTask);

// Update task (admin only)
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateTask);

// Delete task (admin only)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteTask);

export default router;
