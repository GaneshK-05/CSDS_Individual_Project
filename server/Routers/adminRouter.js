import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import roleMiddleware from "../Middleware/roleMiddleware.js";
import { setDeadline, getAllSubmissions, getDeadline } from "../Controllers/adminController.js";

const router = express.Router();

router.post("/deadline", authMiddleware, roleMiddleware("ADMIN"), setDeadline);
router.get("/deadline", authMiddleware, roleMiddleware("ADMIN"), getDeadline);
router.get("/submissions", authMiddleware, roleMiddleware("ADMIN"), getAllSubmissions);

export default router;