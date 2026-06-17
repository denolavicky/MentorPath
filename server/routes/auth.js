import express from "express";
import { protect } from "../middleware/auth.js";
import { register, login, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, (req, res) => res.json({ message: "Logged out" }));
router.post("/verify-email", (req, res) => res.json({ message: "TODO: verify-email" }));
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
