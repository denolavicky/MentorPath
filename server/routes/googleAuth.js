import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @route GET /api/auth/google
// Redirect to Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @route GET /api/auth/google/callback
// Google redirects here after login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      mentorStatus: req.user.mentorStatus,
      subscriptionStatus: req.user.subscriptionStatus,
      onboardingComplete: req.user.onboardingComplete,
    };

    // Redirect to frontend with token in URL
    // Frontend will grab token from URL and store in localStorage
    const redirectUrl = `${process.env.CLIENT_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    res.redirect(redirectUrl);
  }
);

export default router;
