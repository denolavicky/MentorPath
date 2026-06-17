import express from "express";
import { protect } from "../middleware/auth.js";
import { getConversations, getThread, sendMessage } from "../controllers/messagesController.js";

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:userId", protect, getThread);
router.post("/:userId", protect, sendMessage);

export default router;
