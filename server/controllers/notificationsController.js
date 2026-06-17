import Notification from "../models/Notification.js";

// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/notifications/:id/read
export const markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Helper — create a notification (used internally by other controllers)
export const createNotification = async ({ userId, type, title, message, link = "" }) => {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (error) {
    console.error("Create notification error:", error);
  }
};
