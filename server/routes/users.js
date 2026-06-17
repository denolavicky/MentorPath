import express from "express";
import { protect } from "../middleware/auth.js";
import { updateProfile, getProfile, changePassword } from "../controllers/usersController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.post("/avatar", protect, (req, res) => res.json({ message: "TODO: upload avatar" }));
router.get("/saved-mentors", protect, (req, res) => res.json({ message: "TODO: saved mentors" }));
router.post("/saved-mentors/:id", protect, (req, res) => res.json({ message: "TODO: toggle save" }));

export default router;
