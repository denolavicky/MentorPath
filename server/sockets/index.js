// Socket.io event handlers
// This file will grow as we implement real-time features

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a room (user joins their own userId room for notifications)
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Join a conversation room (for 1-on-1 chat)
    // roomId = sorted combo of both user IDs e.g. "userId1_userId2"
    socket.on("join_conversation", (roomId) => {
      socket.join(roomId);
    });

    // Send a message
    socket.on("send_message", (data) => {
      // data: { roomId, message, senderId }
      // TODO: save to DB, then emit to room
      io.to(data.roomId).emit("receive_message", data);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("user_typing", { userId: data.senderId });
    });

    socket.on("stop_typing", (data) => {
      socket.to(data.roomId).emit("user_stop_typing", { userId: data.senderId });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
