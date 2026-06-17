import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";
import { io } from "socket.io-client";

// Dummy session data - will come from real API
const sessionsData = {
  "sess_001": {
    _id: "sess_001",
    topic: "Career roadmap planning",
    date: "Today",
    time: "3:00 PM",
    duration: 60,
    status: "confirmed",
    meetingLink: "https://meet.google.com/new",
    mentor: { _id: "mentor_1", name: "Amara Okafor", avatar: "AO", color: "#6366f1", role: "Software Engineer @ Google" },
    mentee: { _id: "mentee_1", name: "Kofi Asante", avatar: "KA", color: "#10b981" },
    note: "",
  },
  "1": {
    _id: "1",
    topic: "Breaking into tech",
    date: "Today",
    time: "3:00 PM",
    duration: 60,
    status: "confirmed",
    meetingLink: "https://meet.google.com/new",
    mentor: { _id: "mentor_1", name: "Amara Okafor", avatar: "AO", color: "#6366f1", role: "Software Engineer @ Google" },
    mentee: { _id: "mentee_1", name: "Kofi Asante", avatar: "KA", color: "#10b981" },
    note: "",
  },
};

const dummyMessages = [
  { id: "1", senderId: "mentor_1", text: "Hi! Ready for our session? 😊", time: "2:58 PM", isSystem: false },
  { id: "2", senderId: "mentee_1", text: "Yes! Really excited. I've been preparing some questions.", time: "2:59 PM", isSystem: false },
  { id: "3", senderId: "system", text: "Session started at 3:00 PM", time: "3:00 PM", isSystem: true },
];

export default function SessionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const session = sessionsData[id] || sessionsData["sess_001"];

  const isMentor = currentUser?.role === "mentor";
  const other = isMentor ? session.mentee : session.mentor;

  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState(session.note || "");
  const [activePanel, setActivePanel] = useState("chat");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 mins in seconds
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join", currentUser?._id);

    const roomId = [session.mentor._id, session.mentee._id].sort().join("_");
    socketRef.current.emit("join_conversation", roomId);

    socketRef.current.on("receive_message", (data) => {
      if (data.senderId !== currentUser?._id) {
        setMessages(prev => [...prev, { id: Date.now(), senderId: data.senderId, text: data.message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isSystem: false }]);
      }
    });

    socketRef.current.on("user_typing", () => setIsTyping(true));
    socketRef.current.on("user_stop_typing", () => setIsTyping(false));

    return () => socketRef.current?.disconnect();
  }, [currentUser]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeColor = timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#10b981";

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), senderId: currentUser?._id, text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isSystem: false };
    setMessages(prev => [...prev, newMsg]);
    const roomId = [session.mentor._id, session.mentee._id].sort().join("_");
    socketRef.current?.emit("send_message", { roomId, message: input.trim(), senderId: currentUser?._id });
    setInput("");
    inputRef.current?.focus();
  };

  const handleEndSession = () => {
    if (!window.confirm("Are you sure you want to end this session?")) return;
    clearInterval(timerRef.current);
    setSessionEnded(true);
    // TODO: await sessionsAPI.complete(id);
  };

  // Session ended screen
  if (sessionEnded) {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "48px 40px", border: "1px solid #f1f5f9", maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Session complete!</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
            Great session with <strong>{other.name}</strong>. Don't forget to {isMentor ? "add your session notes" : "leave a review"}.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {!isMentor && (
              <Link to={`/session/${id}/review`} style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", textDecoration: "none", padding: "13px", borderRadius: "12px", fontWeight: "700", fontSize: "14px" }}>
                ⭐ Leave a review
              </Link>
            )}
            <Link to={isMentor ? "/mentor/sessions" : "/my-sessions"} style={{ display: "block", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "13px", borderRadius: "12px", fontWeight: "700", fontSize: "14px" }}>
              View all sessions
            </Link>
            <Link to={isMentor ? "/mentor/dashboard" : "/dashboard"} style={{ display: "block", background: "white", color: "#374151", textDecoration: "none", padding: "13px", borderRadius: "12px", fontWeight: "600", fontSize: "14px", border: "1px solid #e5e7eb" }}>
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#0f172a", overflow: "hidden" }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to={isMentor ? "/mentor/dashboard" : "/dashboard"} style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>← Exit</Link>
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${other.color}cc, ${other.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "11px" }}>
              {other.avatar}
            </div>
            <div>
              <div style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>{other.name}</div>
              <div style={{ color: "#64748b", fontSize: "11px" }}>{session.topic}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: "10px", border: `1px solid ${timeColor}33` }}>
          <span style={{ fontSize: "14px" }}>⏱️</span>
          <span style={{ fontSize: "16px", fontWeight: "800", color: timeColor, fontVariantNumeric: "tabular-nums" }}>{formatTime(timeLeft)}</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>remaining</span>
        </div>

        <button onClick={handleEndSession} style={{ background: "#ef4444", color: "white", border: "none", padding: "9px 18px", borderRadius: "9px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
          End session
        </button>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── VIDEO AREA ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Video embed */}
          <div style={{ flex: 1, background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

            {/* Placeholder until Meet opens */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎥</div>
              <h2 style={{ color: "white", fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Video call</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Click below to open your Google Meet session</p>
              <a href={session.meetingLink} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "13px 28px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
                🎥 Open Google Meet
              </a>
              <p style={{ color: "#475569", fontSize: "12px", marginTop: "12px" }}>Opens in a new tab · Share your screen for portfolio reviews</p>
            </div>

            {/* Session info overlay */}
            <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(0,0,0,0.7)", borderRadius: "10px", padding: "10px 14px", backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px" }}>Session topic</div>
              <div style={{ fontSize: "13px", color: "white", fontWeight: "700" }}>{session.topic}</div>
            </div>
          </div>

          {/* Notes section (mentor only) */}
          {isMentor && (
            <div style={{ height: "180px", background: "#1e293b", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>📝 Session notes (only you can see this)</span>
                <button onClick={() => { /* TODO: save notes */ }} style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                  Save notes
                </button>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Take notes during the session... What did you discuss? What are the action items? What should the mentee do next?"
                style={{ width: "100%", height: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#cbd5e1", fontSize: "13px", padding: "10px 12px", resize: "none", fontFamily: "inherit", outline: "none", boxSizing: "border-box", lineHeight: "1.6" }}
              />
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width: "320px", background: "#1e293b", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Panel tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["chat", "details"].map(panel => (
              <button key={panel} onClick={() => setActivePanel(panel)} style={{ flex: 1, padding: "12px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", color: activePanel === panel ? "#a5b4fc" : "#64748b", borderBottom: activePanel === panel ? "2px solid #6366f1" : "2px solid transparent", textTransform: "capitalize", transition: "all 0.15s" }}>
                {panel === "chat" ? "💬 Chat" : "ℹ️ Details"}
              </button>
            ))}
          </div>

          {/* ── CHAT PANEL ── */}
          {activePanel === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.map(msg => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "11px", color: "#475569", background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: "100px" }}>{msg.text}</span>
                      </div>
                    );
                  }
                  const isMe = msg.senderId === currentUser?._id;
                  return (
                    <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "75%" }}>
                        <div style={{ padding: "9px 13px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)", color: isMe ? "white" : "#cbd5e1", fontSize: "13px", lineHeight: "1.5" }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: "10px", color: "#475569", marginTop: "3px", textAlign: isMe ? "right" : "left" }}>{msg.time}</div>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div style={{ display: "flex" }}>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: "5px", height: "5px", background: "#64748b", borderRadius: "50%", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "9px 12px", color: "white", fontSize: "13px", outline: "none", fontFamily: "inherit" }}
                  />
                  <button onClick={handleSend} disabled={!input.trim()} style={{ width: "38px", height: "38px", borderRadius: "10px", background: input.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)", border: "none", color: "white", cursor: input.trim() ? "pointer" : "not-allowed", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── DETAILS PANEL ── */}
          {activePanel === "details" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Participants */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Participants</p>
                  {[session.mentor, session.mentee].map((person, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "8px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `linear-gradient(135deg, ${person.color}cc, ${person.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px" }}>
                        {person.avatar}
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>{person.name}</div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>{i === 0 ? "Mentor" : "Mentee"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Session info */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Session details</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      ["Topic", session.topic],
                      ["Date", session.date],
                      ["Time", session.time],
                      ["Duration", `${session.duration} minutes`],
                      ["Status", session.status],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
                        <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "600", textTransform: "capitalize" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting link */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Video call</p>
                  <a href={session.meetingLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "10px", padding: "12px", textDecoration: "none" }}>
                    <span style={{ fontSize: "16px" }}>🎥</span>
                    <span style={{ color: "#a5b4fc", fontWeight: "700", fontSize: "13px" }}>Open Google Meet</span>
                  </a>
                </div>

                {/* End session */}
                <button onClick={handleEndSession} style={{ width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}>
                  End session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
