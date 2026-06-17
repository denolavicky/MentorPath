import User from "../models/User.js";
import Session from "../models/Session.js";
import { sendMentorApprovalEmail } from "../utils/email.js";

// @route GET /api/admin/applications
export const getApplications = async (req, res) => {
  try {
    const applications = await User.find({
      role: "mentor",
      mentorStatus: { $in: ["pending", "approved", "rejected"] },
    }).select("-password").sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/admin/applications/:id
export const reviewApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // If approving, also update role to "mentor"
    const updateData = { mentorStatus: status };
    if (status === "approved") updateData.role = "mentor";

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Send approval/rejection email (don't block response if email fails)
    try {
      await sendMentorApprovalEmail({ user, approved: status === "approved" });
    } catch (emailError) {
      console.error("Approval email failed (status still updated):", emailError.message);
    }

    res.json({ user, message: `Application ${status} successfully` });
  } catch (error) {
    console.error("Review application error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMentors = await User.countDocuments({ role: "mentor", mentorStatus: "approved" });
    const totalMentees = await User.countDocuments({ role: "mentee" });
    const pendingApplications = await User.countDocuments({ mentorStatus: "pending" });
    const totalSessions = await Session.countDocuments();

    res.json({
      stats: { totalUsers, totalMentors, totalMentees, pendingApplications, totalSessions },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/admin/users/:id
export const editUser = async (req, res) => {
  try {
    const allowed = ["name", "email", "role", "mentorStatus"];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
