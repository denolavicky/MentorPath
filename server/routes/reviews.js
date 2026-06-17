import express from "express";
import { protect, authorise } from "../middleware/auth.js";
import { leaveReview, getMentorReviews } from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/mentor/:id", getMentorReviews);
router.post("/", protect, authorise("mentee"), leaveReview);

export default router;
