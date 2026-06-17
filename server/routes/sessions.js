import express from "express";
import { protect, authorise } from "../middleware/auth.js";
import { bookSession, getMySessions, getSession, cancelSession, completeSession, getSessionRoom } from "../controllers/sessionsController.js";

const router = express.Router();

router.get("/", protect, getMySessions);
router.post("/", protect, authorise("mentee"), bookSession);
router.get("/:id", protect, getSession);
router.put("/:id/cancel", protect, cancelSession);
router.put("/:id/complete", protect, completeSession);
router.get("/:id/room", protect, getSessionRoom);

export default router;
