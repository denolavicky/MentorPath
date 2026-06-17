import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../store/slices/authSlice.js";
import { io } from "socket.io-client";

const navItems = [
  { icon: "⊞", label: "Dashboard", path: "/mentor/dashboard" },
  { icon: "📅", label: "My sessions", path: "/mentor/sessions" },
  { icon: "🗓️", label: "Availability", path: "/mentor/availability" },
  { icon: "💬", label: "Messages", path: "/mentor/messages" },
  { icon: "🗺️", label: "Roadmaps", path: "/mentor/roadmaps" },
  { icon: "💰", label: "Earnings", path: "/mentor/earnings" },
  { icon: "👤", label: "Edit profile", path: "/mentor/profile/edit" },
  { icon: "💲", label: "Session pricing", path: "/mentor/pricing" },
  { icon: "🔔", label: "Notifications", path: "/mentor/notifications" },
];

const dummyConversations = [
  { userId: "mentee_1", name: "Kofi Asante", avatar: "KA", color: "#6366f1", lastMessage: "Looking forward to tomorrow!", lastTime: "1h ago", unread: 2, online: true },
  { userId: "mentee_2", name: "Fatima Bello", avatar: "FB", color: "#10b981", lastMessage: "Can we discuss my portfolio?", lastTime: "3h ago", unread: 1, online: true },
  { userId: "mentee_3", name: "David Osei", avatar: "DO", color: "#f59e0b", lastMessage: "Thank you so much!", lastTime: "Yesterday", unread: 0, online: false },
];

const dummyMessages = {
  mentee_1: [
    { id: "1", senderId: "mentee_1", text: "Hi! Can't wait for our session tomorrow.", time: "10:00 AM", isMe: false },
    { id: "2", senderId: "me", text: "Me too! Make sure you have your portfolio ready.", time: "10:05 AM", isMe: true },
    { id: "3", senderId: "mentee_1", text: "Looking forward to tomorrow!", time: "10:10 AM", isMe: false },
  ],
  mentee_2: [
    { id: "1", senderId: "mentee_2", text: "Can we discuss my portfolio before the session?", time: "9:00 AM", isMe: false },
    { id: "2", senderId: "me", text: "Sure! Send me the link and I'll review it.", time: "9:05 AM", isMe: true },
  ],
  mentee_3: [
    { id: "1", senderId: "me", text: "Great session today! Keep up the momentum.", time: "Yesterday", isMe: true },
    { id: "2", senderId: "mentee_3", text: "Thank you so much!", time: "Yesterday", isMe: false },
  ],
};

export default function MentorMessages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectUser);
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState(dummyConversations);
  const [activeConv, setActiveConv] = useState("mentee_1");
  const [messages, setMessages] = useState(dummyMessages["mentee_1"]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    setMessages(dummyMessages[activeConv] || []);
    setConversations(prev => prev.map(c => c.userId === activeConv ? { ...c, unread: 0 } : c));
  }, [activeConv]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join", currentUser?._id);
    socketRef.current.on("receive_message", (data) => {
      if (data.senderId !== currentUser?._id) {
        setMessages(prev => [...prev, { id: Date.now(), senderId: data.senderId, text: data.message, time: "Just now", isMe: false }]);
      }
    });
    return () => socketRef.current?.disconnect();
  }, [currentUser]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), senderId: currentUser?._id, text: input.trim(), time: "Just now", isMe: true }]);
    setInput("");
  };

  const activeContact = conversations.find(c => c.userId === activeConv);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: collapsed ? "64px" : "240px", minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", transition: "width 0.3s ease" }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {!collapsed && <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span></div><span style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>MentorPath</span></Link>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "16px", marginLeft: collapsed ? "auto" : "0", marginRight: collapsed ? "auto" : "0" }}>{collapsed ? "→" : "←"}</button>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", textDecoration: "none", background: isActive ? "rgba(139,92,246,0.15)" : "transparent", justifyContent: collapsed ? "center" : "flex-start" }}><span style={{ fontSize: "16px" }}>{item.icon}</span>{!collapsed && <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#c4b5fd" : "#94a3b8" }}>{item.label}</span>}</Link>;
          })}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}>
            <span>🚪</span>{!collapsed && <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#f8fafc" }}>
        {/* Conversations */}
        <div style={{ width: "280px", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", background: "white", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Messages</h2>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map(conv => (
              <div key={conv.userId} onClick={() => setActiveConv(conv.userId)} style={{ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid #f8fafc", background: activeConv === conv.userId ? "#f0f0ff" : "white", borderLeft: activeConv === conv.userId ? "3px solid #8b5cf6" : "3px solid transparent" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: `linear-gradient(135deg, ${conv.color}cc, ${conv.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>{conv.avatar}</div>
                    {conv.online && <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", border: "2px solid white" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{conv.name}</span>
                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>{conv.lastTime}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>{conv.lastMessage}</span>
                      {conv.unread > 0 && <span style={{ background: "#8b5cf6", color: "white", fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "100px" }}>{conv.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        {activeContact && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", background: "white", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `linear-gradient(135deg, ${activeContact.color}cc, ${activeContact.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>{activeContact.avatar}</div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>{activeContact.name}</div>
                <div style={{ fontSize: "11px", color: activeContact.online ? "#10b981" : "#94a3b8", fontWeight: "600" }}>{activeContact.online ? "Online" : "Offline"}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.isMe ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: msg.isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.isMe ? "linear-gradient(135deg, #8b5cf6, #a78bfa)" : "white", color: msg.isMe ? "white" : "#374151", fontSize: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: "14px 20px", background: "white", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSend(); }} placeholder="Type a message..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <button onClick={handleSend} disabled={!input.trim()} style={{ width: "42px", height: "42px", borderRadius: "10px", background: input.trim() ? "linear-gradient(135deg, #8b5cf6, #a78bfa)" : "#f1f5f9", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", color: "white", fontSize: "16px" }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}