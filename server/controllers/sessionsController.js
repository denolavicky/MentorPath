import Session from "../models/Session.js";
import User from "../models/User.js";
import { sendBookingConfirmation, sendMentorBookingAlert } from "../utils/email.js";

// ── @route POST /api/sessions ── Book a session
export const bookSession = async (req, res) => {
  try {
    const { mentorId, date, time, topic, note } = req.body;

    if (!mentorId || !date || !time || !topic) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check mentor exists and is approved
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor" || mentor.mentorStatus !== "approved") {
      return res.status(404).json({ message: "Mentor not found or not approved" });
    }

    // Check free plan session limit
    const mentee = await User.findById(req.user._id);
    if (mentee.subscriptionStatus === "free" && mentee.sessionsUsedThisMonth >= 3) {
      return res.status(403).json({ message: "You've used all 3 free sessions this month. Upgrade to Pro for unlimited sessions." });
    }

    // Check if slot is already booked
    const existingSession = await Session.findOne({
      mentor: mentorId,
      date: new Date(date),
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    if (existingSession) {
      return res.status(400).json({ message: "This time slot is already booked. Please choose another." });
    }

    // Create session
    const session = await Session.create({
      mentee: req.user._id,
      mentor: mentorId,
      date: new Date(date),
      time,
      topic,
      note: note || "",
      price: mentor.sessionPrice || 0,
      status: "confirmed",
    });

    // Increment mentee's session count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { sessionsUsedThisMonth: 1 },
    });

    // Populate mentor and mentee for response + emails
    const populated = await Session.findById(session._id)
      .populate("mentor", "name email avatar careerField sessionPrice")
      .populate("mentee", "name email avatar");

    // Send confirmation emails (don't block response if email fails)
    try {
      await Promise.all([
        sendBookingConfirmation({
          mentee: populated.mentee,
          mentor: populated.mentor,
          session: populated,
        }),
        sendMentorBookingAlert({
          mentee: populated.mentee,
          mentor: populated.mentor,
          session: populated,
        }),
      ]);
    } catch (emailError) {
      console.error("Email sending failed (session still booked):", emailError.message);
    }

    res.status(201).json({ session: populated });
  } catch (error) {
    console.error("Book session error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── @route GET /api/sessions ── Get all sessions for current user
export const getMySessions = async (req, res) => {
  try {
    const query = req.user.role === "mentor"
      ? { mentor: req.user._id }
      : { mentee: req.user._id };

    const sessions = await Session.find(query)
      .populate("mentor", "name email avatar sessionPrice careerField")
      .populate("mentee", "name email avatar")
      .sort({ date: 1 });

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── @route GET /api/sessions/:id ── Get single session
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("mentor", "name email avatar sessionPrice careerField")
      .populate("mentee", "name email avatar");

    if (!session) return res.status(404).json({ message: "Session not found" });

    const isMentor = session.mentor._id.toString() === req.user._id.toString();
    const isMentee = session.mentee._id.toString() === req.user._id.toString();
    if (!isMentor && !isMentee) return res.status(403).json({ message: "Not authorized" });

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── @route PUT /api/sessions/:id/cancel ── Cancel a session
export const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isMentor = session.mentor.toString() === req.user._id.toString();
    const isMentee = session.mentee.toString() === req.user._id.toString();
    if (!isMentor && !isMentee) return res.status(403).json({ message: "Not authorized" });

    session.status = "cancelled";
    session.cancelledBy = req.user._id;
    session.cancelReason = req.body.reason || "";
    await session.save();

    // Refund session count if mentee cancels
    if (isMentee) {
      await User.findByIdAndUpdate(session.mentee, {
        $inc: { sessionsUsedThisMonth: -1 },
      });
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── @route PUT /api/sessions/:id/complete ── Mark session complete
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = "completed";
    if (req.body.mentorNotes) session.mentorNotes = req.body.mentorNotes;
    await session.save();

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── @route GET /api/sessions/:id/room ── Get session room data
export const getSessionRoom = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("mentor", "name email avatar")
      .populate("mentee", "name email avatar");

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.meetingLink) {
      session.meetingLink = `https://meet.google.com/new`;
      await session.save();
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
