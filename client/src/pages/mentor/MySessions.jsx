import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../store/slices/authSlice.js";

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

function MentorSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ width: collapsed ? "64px" : "240px", minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", transition: "width 0.3s ease" }}>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {!collapsed && (
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>MentorPath</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "16px", marginLeft: collapsed ? "auto" : "0", marginRight: collapsed ? "auto" : "0" }}>
          {collapsed ? "→" : "←"}
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>
              {user?.name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div>
              <div style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>{user?.name}</div>
              <div style={{ color: "#10b981", fontSize: "11px", fontWeight: "600" }}>✓ Verified Mentor</div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", textDecoration: "none", background: isActive ? "rgba(139,92,246,0.15)" : "transparent", border: isActive ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent", justifyContent: collapsed ? "center" : "flex-start" }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#c4b5fd" : "#94a3b8" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}>
          <span>🚪</span>
          {!collapsed && <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>}
        </button>
      </div>
    </div>
  );
}

const dummySessions = [
  { _id: "1", mentee: { name: "Kofi Asante", avatar: "KA", color: "#6366f1" }, date: new Date(Date.now() + 86400000), time: "3:00 PM", topic: "Career roadmap planning", status: "confirmed", price: 25, notes: "" },
  { _id: "2", mentee: { name: "Fatima Bello", avatar: "FB", color: "#10b981" }, date: new Date(Date.now() + 86400000 * 4), time: "6:00 PM", topic: "Portfolio review", status: "confirmed", price: 25, notes: "" },
  { _id: "3", mentee: { name: "David Osei", avatar: "DO", color: "#f59e0b" }, date: new Date(Date.now() + 86400000 * 7), time: "10:00 AM", topic: "Mock interview prep", status: "confirmed", price: 25, notes: "" },
  { _id: "4", mentee: { name: "Blessing O.", avatar: "BO", color: "#8b5cf6" }, date: new Date(Date.now() - 86400000 * 2), time: "4:00 PM", topic: "Breaking into the industry", status: "completed", price: 25, notes: "Great session. Gave her a clear action plan." },
  { _id: "5", mentee: { name: "Emeka N.", avatar: "EN", color: "#ef4444" }, date: new Date(Date.now() - 86400000 * 7), time: "5:00 PM", topic: "Skills gap analysis", status: "completed", price: 25, notes: "Identified key skill gaps. Recommended React and system design." },
  { _id: "6", mentee: { name: "Aisha D.", avatar: "AD", color: "#0ea5e9" }, date: new Date(Date.now() - 86400000 * 14), time: "7:00 PM", topic: "Job application strategy", status: "cancelled", price: 25, notes: "" },
];

const statusConfig = {
  confirmed: { label: "Upcoming", color: "#8b5cf6", bg: "#f5f3ff" },
  completed: { label: "Completed", color: "#10b981", bg: "#f0fdf4" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
};

function SessionCard({ session, onCancel, onComplete, onAddNote }) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(session.notes || "");
  const status = statusConfig[session.status];
  const isUpcoming = session.status === "confirmed";
  const isCompleted = session.status === "completed";

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `linear-gradient(135deg, ${session.mentee.color}cc, ${session.mentee.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
            {session.mentee.avatar}
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a", marginBottom: "2px" }}>{session.mentee.name}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Mentee</div>
          </div>
        </div>
        <span style={{ fontSize: "11px", fontWeight: "700", color: status.color, background: status.bg, padding: "4px 12px", borderRadius: "100px" }}>
          {status.label}
        </span>
      </div>

      {/* Session details */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "14px", padding: "12px", background: "#fafafa", borderRadius: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px" }}>📅</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{formatDate(session.date)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px" }}>🕐</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{session.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px" }}>📋</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{session.topic}</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "#10b981" }}>${session.price}</span>
        </div>
      </div>

      {/* Notes (completed sessions) */}
      {isCompleted && (
        <div style={{ marginBottom: "14px" }}>
          {!showNoteInput && session.notes && (
            <div style={{ padding: "10px 14px", background: "#f5f3ff", borderRadius: "10px", border: "1px solid #e0d9ff" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#8b5cf6", marginBottom: "4px" }}>📝 Session notes</p>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5" }}>{session.notes}</p>
            </div>
          )}
          {showNoteInput && (
            <div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your session notes..." rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid #8b5cf6", fontSize: "13px", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => { onAddNote(session._id, note); setShowNoteInput(false); }} style={{ background: "#8b5cf6", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>Save notes</button>
                <button onClick={() => setShowNoteInput(false)} style={{ background: "white", border: "1px solid #e5e7eb", color: "#374151", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {isUpcoming && (
          <>
            <Link to={`/mentor/session/${session._id}/room`} style={{ padding: "9px 16px", borderRadius: "9px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", textDecoration: "none", fontWeight: "700", fontSize: "12px" }}>
              Join session
            </Link>
            <button onClick={() => onComplete(session._id)} style={{ padding: "9px 16px", borderRadius: "9px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#10b981", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
              Mark complete
            </button>
            <button onClick={() => onCancel(session._id)} style={{ padding: "9px 16px", borderRadius: "9px", background: "white", border: "1px solid #fecaca", color: "#ef4444", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
              Cancel
            </button>
          </>
        )}
        {isCompleted && (
          <button onClick={() => setShowNoteInput(!showNoteInput)} style={{ padding: "9px 16px", borderRadius: "9px", background: "#f5f3ff", border: "1px solid #e0d9ff", color: "#8b5cf6", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
            {session.notes ? "Edit notes" : "+ Add notes"}
          </button>
        )}
        {session.status === "cancelled" && (
          <span style={{ fontSize: "12px", color: "#94a3b8", padding: "9px 0" }}>This session was cancelled.</span>
        )}
      </div>
    </div>
  );
}

function MentorSessionsContent() {
  const [sessions, setSessions] = useState(dummySessions);
  const [filter, setFilter] = useState("all");

  const handleCancel = (id) => {
    if (!window.confirm("Cancel this session?")) return;
    setSessions(prev => prev.map(s => s._id === id ? { ...s, status: "cancelled" } : s));
  };

  const handleComplete = (id) => {
    setSessions(prev => prev.map(s => s._id === id ? { ...s, status: "completed" } : s));
  };

  const handleAddNote = (id, note) => {
    setSessions(prev => prev.map(s => s._id === id ? { ...s, notes: note } : s));
  };

  const filtered = sessions.filter(s => filter === "all" ? true : s.status === filter);
  const upcoming = sessions.filter(s => s.status === "confirmed");
  const completed = sessions.filter(s => s.status === "completed");
  const totalEarned = completed.reduce((acc, s) => acc + s.price, 0);

  return (
    <div style={{ padding: "32px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>My Sessions</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Manage your upcoming and past mentoring sessions.</p>
        </div>
        <Link to="/mentor/availability" style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", textDecoration: "none", padding: "11px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px" }}>
          + Set availability
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total sessions", value: sessions.length, color: "#8b5cf6", icon: "📅" },
          { label: "Upcoming", value: upcoming.length, color: "#6366f1", icon: "⏰" },
          { label: "Completed", value: completed.length, color: "#10b981", icon: "✅" },
          { label: "Earned (completed)", value: `$${totalEarned}`, color: "#f59e0b", icon: "💰" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "white", borderRadius: "14px", padding: "18px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: stat.color, marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { key: "all", label: "All sessions" },
          { key: "confirmed", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: filter === tab.key ? "#8b5cf6" : "white", color: filter === tab.key ? "white" : "#64748b", border: filter === tab.key ? "none" : "1px solid #e5e7eb", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filtered.map(session => (
            <SessionCard key={session._id} session={session} onCancel={handleCancel} onComplete={handleComplete} onAddNote={handleAddNote} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No sessions found</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
            {filter === "all" ? "You haven't had any sessions yet." : `No ${filter} sessions.`}
          </p>
          <Link to="/mentor/availability" style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", textDecoration: "none", padding: "11px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", display: "inline-block" }}>
            Set your availability →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MentorSessions() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <MentorSessionsContent />
      </div>
    </div>
  );
}
