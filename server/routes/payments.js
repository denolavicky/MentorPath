import express from "express";
import { protect } from "../middleware/auth.js";
import { createCheckout, subscribe, getHistory } from "../controllers/paymentsController.js";

const router = express.Router();

router.post("/checkout", protect, createCheckout);
router.post("/subscribe", protect, subscribe);
router.get("/history", protect, getHistory);
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  // TODO: handle stripe webhook events
  res.json({ received: true });
});

export default router;
