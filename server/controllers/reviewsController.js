import Review from "../models/Review.js";
import User from "../models/User.js";
import Session from "../models/Session.js";

// @route POST /api/reviews
export const leaveReview = async (req, res) => {
  try {
    const { mentorId, sessionId, rating, text, tags } = req.body;

    if (!mentorId || !rating) {
      return res.status(400).json({ message: "Mentor and rating are required." });
    }

    // Check if review already exists for this session
    if (sessionId) {
      const existing = await Review.findOne({ session: sessionId, mentee: req.user._id });
      if (existing) return res.status(400).json({ message: "You've already reviewed this session." });
    }

    const review = await Review.create({
      mentee: req.user._id,
      mentor: mentorId,
      session: sessionId || null,
      rating,
      text: text || "",
      tags: tags || [],
    });

    // Mark session as reviewed
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, { reviewLeft: true });
    }

    // Update mentor's average rating
    const allReviews = await Review.find({ mentor: mentorId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(mentorId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error("Leave review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/reviews/mentor/:id
export const getMentorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mentor: req.params.id })
      .populate("mentee", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
