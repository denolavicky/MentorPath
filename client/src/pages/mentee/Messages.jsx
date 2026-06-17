import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { io } from "socket.io-client";

// Dummy conversations — will be replaced by real API
const dummyConversations = [
  {
    userId: "mentor_1",
    name: "Amara Okafor",
    avatar: "AO",
    color: "#6366f1",
    role: "Software Engineer @ Google",
    lastMessage: "See you at 3PM tomorrow!",
    lastTime: "2h ago",
    unread: 2,
    online: true,
  },
  {
    userId: "mentor_2",
    name: "Tunde Adeyemi",
    avatar: "TA",
    color: "#10b981",
    role: "Product Manager @ Flutterwave",
    lastMessage: "Great progress on your portfolio!",
    lastTime: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    userId: "mentor_3",
    name: "Chioma Eze",
    avatar: "CE",
    color: "#f59e0b",
    role: "UX Design Lead @ Microsoft",
    lastMessage: "Review your Figma file before our session",
    lastTime: "2 days ago",
    unread: 0,
    online: true,
  },
];

const dummyMessages = {
  mentor_1: [
    { id: "1", senderId: "mentor_1", text: "Hey! Looking forward to our session tomorrow.", time: "10:00 AM", isMe: false },
    { id: "2", senderId: "me", text: "Me too! I've been working on my portfolio like you suggested.", time: "10:05 AM", isMe: true },
    { id: "3", senderId: "mentor_1", text: "That's great! Make sure to include your GitHub links too.", time: "10:08 AM", isMe: false },
    { id: "4", senderId: "me", text: "Done! I also added descriptions for each project.", time: "10:12 AM", isMe: true },
    { id: "5", senderId: "mentor_1", text: "Perfect. See you at 3PM tomorrow!", time: "10:15 AM", isMe: false },
  ],
  mentor_2: [
    { id: "1", senderId: "mentor_2", text: "How's the PM case study coming along?", time: "Yesterday", isMe: false },
    { id: "2", senderId: "me", text: "Almost done! Just need to add the metrics section.", time: "Yesterday", isMe: true },
    { id: "3", senderId: "mentor_2", text: "Great progress on your portfolio!", time: "Yesterday", isMe: false },
  ],
  mentor_3: [
    { id: "1", senderId: "mentor_3", text: "Before our next session, review your Figma file.", time: "2 days ago", isMe: false },
    { id: "2", senderId: "me", text: "Will do! Should I redesign the onboarding flow?", time: "2 days ago", isMe: true },
    { id: "3", senderId: "mentor_3", text: "Review your Figma file before our session", time: "2 days ago", isMe: false },
  ],
};

function MessagesContent() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  const [conversations, setConversations] = useState(dummyConversations);
  const [activeConv, setActiveConv] = useState(userId || conversations[0]?.userId);
  const [messages, setMessages] = useState(dummyMessages[activeConv] || []);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Switch conversation
  useEffect(() => {
    setMessages(dummyMessages[activeConv] || []);
    // Mark as read
    setConversations(prev => prev.map(c => c.userId === activeConv ? { ...c, unread: 0 } : c));
  }, [activeConv]);

  // Socket.io setup
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join", currentUser?._id);

    socketRef.current.on("receive_message", (data) => {
      if (data.senderId !== currentUser?._id) {
        setMessages(prev => [...prev, { id: Date.now(), senderId: data.senderId, text: data.message, time: "Just now", isMe: false }]);
      }
    });

    socketRef.current.on("user_typing", () => setIsTyping(true));
    socketRef.current.on("user_stop_typing", () => setIsTyping(false));

    return () => socketRef.current?.disconnect();
  }, [currentUser]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), senderId: currentUser?._id, text: input.trim(), time: "Just now", isMe: true };
    setMessages(prev => [...prev, newMsg]);

    // Emit via socket
    const roomId = [currentUser?._id, activeConv].sort().join("_");
    socketRef.current?.emit("send_message", { roomId, message: input.trim(), senderId: currentUser?._id });
    socketRef.current?.emit("stop_typing", { roomId, senderId: currentUser?._id });

    // Update last message in conversation list
    setConversations(prev => prev.map(c => c.userId === activeConv ? { ...c, lastMessage: input.trim(), lastTime: "Just now" } : c));

    setInput("");
    inputRef.current?.focus();
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    const roomId = [currentUser?._id, activeConv].sort().join("_");
    socketRef.current?.emit("typing", { roomId, senderId: currentUser?._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { roomId, senderId: currentUser?._id });
    }, 1500);
  };

  const activeContact = conversations.find(c => c.userId === activeConv);
  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 0px)", overflow: "hidden" }}>

      {/* ── LEFT: Conversations list ── */}
      <div style={{ width: "300px", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0, background: "white" }}>

        {/* Header */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
              Messages {totalUnread > 0 && <span style={{ background: "#6366f1", color: "white", fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "100px", marginLeft: "6px" }}>{totalUnread}</span>}
            </h2>
          </div>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}>🔍</span>
            <input placeholder="Search conversations..." style={{ width: "100%", padding: "8px 10px 8px 30px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map(conv => (
            <div key={conv.userId} onClick={() => setActiveConv(conv.userId)} style={{
              padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid #f8fafc",
              background: activeConv === conv.userId ? "#f0f0ff" : "white",
              borderLeft: activeConv === conv.userId ? "3px solid #6366f1" : "3px solid transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (activeConv !== conv.userId) e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={e => { if (activeConv !== conv.userId) e.currentTarget.style.background = "white"; }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `linear-gradient(135deg, ${conv.color}cc, ${conv.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>
                    {conv.avatar}
                  </div>
                  {conv.online && <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", border: "2px solid white" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{conv.name}</span>
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>{conv.lastTime}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{conv.lastMessage}</span>
                    {conv.unread > 0 && <span style={{ background: "#6366f1", color: "white", fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "100px", flexShrink: 0 }}>{conv.unread}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Chat window ── */}
      {activeContact ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minWidth: 0 }}>

          {/* Chat header */}
          <div style={{ padding: "16px 20px", background: "white", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: `linear-gradient(135deg, ${activeContact.color}cc, ${activeContact.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>
                {activeContact.avatar}
              </div>
              {activeContact.online && <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", border: "2px solid white" }} />}
            </div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>{activeContact.name}</div>
              <div style={{ fontSize: "11px", color: activeContact.online ? "#10b981" : "#94a3b8", fontWeight: "600" }}>
                {activeContact.online ? "Online" : "Offline"}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <button style={{ background: "#f0f0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#6366f1" }}>
                📅 Book session
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.isMe ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "65%" }}>
                  <div style={{
                    padding: "11px 15px", borderRadius: msg.isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.isMe ? `linear-gradient(135deg, ${activeContact.color}, ${activeContact.color}cc)` : "white",
                    color: msg.isMe ? "white" : "#374151",
                    fontSize: "14px", lineHeight: "1.5", fontWeight: "500",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", textAlign: msg.isMe ? "right" : "left" }}>{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "white", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: "6px", height: "6px", background: "#94a3b8", borderRadius: "50%", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 20px", background: "white", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "12px", border: "2px solid #e5e7eb", padding: "10px 14px", transition: "border-color 0.2s" }}
                onFocus={() => {}} onBlur={() => {}}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  style={{ width: "100%", background: "none", border: "none", outline: "none", resize: "none", fontSize: "14px", fontFamily: "inherit", color: "#374151", lineHeight: "1.5" }}
                />
              </div>
              <button onClick={handleSend} disabled={!input.trim()} style={{
                width: "44px", height: "44px", borderRadius: "12px", border: "none",
                background: input.trim() ? `linear-gradient(135deg, ${activeContact.color}, ${activeContact.color}cc)` : "#f1f5f9",
                color: input.trim() ? "white" : "#94a3b8",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No conversation selected</h3>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Pick a conversation from the left to start chatting.</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default function Messages() {
  return (
    <MenteeLayout>
      <MessagesContent />
    </MenteeLayout>
  );
}
