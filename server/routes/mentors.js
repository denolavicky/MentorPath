import express from "express";
import { protect, authorise, requireVerified } from "../middleware/auth.js";
import { applyToMentor, getAllMentors, getMentorById, getApplicationStatus } from "../controllers/mentorsController.js";

const router = express.Router();

router.get("/", getAllMentors);
router.get("/application/status", protect, getApplicationStatus);
router.get("/:id", getMentorById);
router.post("/apply", protect, applyToMentor);
router.put("/profile", protect, authorise("mentor"), requireVerified, (req, res) => res.json({ message: "TODO: update mentor profile" }));
router.get("/availability/me", protect, authorise("mentor"), (req, res) => res.json({ message: "TODO: get availability" }));
router.put("/availability", protect, authorise("mentor"), requireVerified, (req, res) => res.json({ message: "TODO: set availability" }));
router.put("/pricing", protect, authorise("mentor"), requireVerified, (req, res) => res.json({ message: "TODO: update pricing" }));
router.get("/earnings/me", protect, authorise("mentor"), (req, res) => res.json({ message: "TODO: earnings" }));

export default router;
