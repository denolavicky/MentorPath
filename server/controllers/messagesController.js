import Message from "../models/Message.js";
import User from "../models/User.js";

const getRoomId = (userId1, userId2) => [userId1, userId2].sort().join("_");

// @route GET /api/messages — get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique roomIds this user is part of
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: -1 });

    // Get unique conversation partners
    const partnerIds = [...new Set(
      messages.map(m =>
        m.sender.toString() === userId.toString()
          ? m.receiver.toString()
          : m.sender.toString()
      )
    )];

    // Build conversation list
    const conversations = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const partner = await User.findById(partnerId).select("name avatar role mentorStatus");
        const roomId = getRoomId(userId, partnerId);
        const lastMessage = await Message.findOne({ roomId }).sort({ createdAt: -1 });
        const unreadCount = await Message.countDocuments({ roomId, receiver: userId, read: false });
        return { partner, lastMessage, unreadCount, roomId };
      })
    );

    res.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/messages/:userId — get message thread with a user
export const getThread = async (req, res) => {
  try {
    const roomId = getRoomId(req.user._id, req.params.userId);
    const messages = await Message.find({ roomId })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { roomId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/messages/:userId — send a message
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    const roomId = getRoomId(req.user._id, req.params.userId);

    const message = await Message.create({
      sender: req.user._id,
      receiver: req.params.userId,
      text: text.trim(),
      roomId,
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    res.status(201).json({ message: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
