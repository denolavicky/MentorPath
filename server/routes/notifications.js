import express from "express";
import { protect } from "../middleware/auth.js";
import { getNotifications, markRead, markAllRead } from "../controllers/notificationsController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAllRead);
router.put("/:id/read", protect, markRead);

export default router;
