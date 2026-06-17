import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../store/slices/authSlice.js";
import { sessionsAPI, mentorsAPI } from "../../api/index.js";

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

function nameColor(name = "") {
  const colors = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ef4444","#0ea5e9","#f97316","#14b8a6"];
  return colors[name.charCodeAt(0) % colors.length];
}

function initials(name = "") {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

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
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px", flexShrink: 0 }}>
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
            <Link key={item.path} to={item.path}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", textDecoration: "none", background: isActive ? "rgba(139,92,246,0.15)" : "transparent", border: isActive ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent", transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start" }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#c4b5fd" : "#94a3b8" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => { dispatch(logout()); navigate("/login"); }}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}>
          <span style={{ fontSize: "16px" }}>🚪</span>
          {!collapsed && <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  const user = useSelector(selectUser);

  const [sessions, setSessions] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionsRes, earningsRes] = await Promise.all([
          sessionsAPI.getMySessions(),
          mentorsAPI.getEarnings(),
        ]);
        setSessions(sessionsRes.data.sessions || []);
        setEarnings(earningsRes.data || null);
      } catch (err) {
        console.error("Mentor dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Derive stats from real sessions
  const upcoming = sessions.filter(s => s.status === "confirmed" || s.status === "pending");
  const completed = sessions.filter(s => s.status === "completed");
  const thisMonth = completed.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalEarned = completed.reduce((acc, s) => acc + (s.price || 0), 0);
  const monthEarned = thisMonth.reduce((acc, s) => acc + (s.price || 0), 0);
  const platformCut = Math.round(monthEarned * 0.2);
  const mentorPayout = monthEarned - platformCut;

  const stats = [
    { label: "Total sessions", value: loading ? "..." : sessions.length, icon: "📅", color: "#8b5cf6" },
    { label: "This month", value: loading ? "..." : thisMonth.length, icon: "📆", color: "#6366f1" },
    { label: "Total earned", value: loading ? "..." : `$${totalEarned}`, icon: "💰", color: "#10b981" },
    { label: "Avg rating", value: user?.rating ? `${user.rating}★` : "—", icon: "⭐", color: "#f59e0b" },
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />

      <div style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Here's your mentoring activity overview.</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link to="/mentor/notifications" style={{ position: "relative", background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px", cursor: "pointer", textDecoration: "none", display: "flex" }}>
              <span style={{ fontSize: "18px" }}>🔔</span>
            </Link>
            <Link to="/mentor/profile/edit" style={{ textDecoration: "none" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px" }}>
                {user?.name?.charAt(0).toUpperCase() || "M"}
              </div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "24px" }}>{stat.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: stat.color, background: `${stat.color}15`, padding: "3px 8px", borderRadius: "6px" }}>all time</span>
              </div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Earnings banner */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid rgba(139,92,246,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>💰 Earnings this month</p>
            {loading
              ? <div style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>Loading...</div>
              : <>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "white", marginBottom: "4px" }}>${mentorPayout}</div>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                    {thisMonth.length} sessions · ${monthEarned} gross · Platform takes 20% (${platformCut})
                  </p>
                </>
            }
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/mentor/earnings" style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", textDecoration: "none", padding: "11px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px" }}>View earnings →</Link>
            <Link to="/mentor/availability" style={{ background: "rgba(255,255,255,0.08)", color: "white", textDecoration: "none", padding: "11px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", border: "1px solid rgba(255,255,255,0.1)" }}>Set availability</Link>
          </div>
        </div>

        {/* Main row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Upcoming sessions */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Upcoming sessions</h2>
              <Link to="/mentor/sessions" style={{ fontSize: "12px", color: "#8b5cf6", textDecoration: "none", fontWeight: "600" }}>View all</Link>
            </div>

            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", padding: "20px" }}>Loading sessions...</p>
            ) : upcoming.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {upcoming.slice(0, 3).map(session => {
                  const mentee = session.mentee || {};
                  const color = nameColor(mentee.name || "A");
                  return (
                    <div key={session._id} style={{ padding: "14px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px", flexShrink: 0, overflow: "hidden" }}>
                          {mentee.avatar
                            ? <img src={mentee.avatar} alt={mentee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : initials(mentee.name || "?")}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{mentee.name || "Mentee"}</div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>{session.topic}</div>
                        </div>
                        <span style={{ marginLeft: "auto", fontSize: "13px", fontWeight: "800", color: "#10b981" }}>${session.price || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "600", background: "#eef2ff", padding: "3px 8px", borderRadius: "6px" }}>
                          📅 {formatDate(session.date)} · {session.time}
                        </span>
                        <Link to={`/mentor/session/${session._id}/room`} style={{ fontSize: "11px", fontWeight: "700", color: "#8b5cf6", background: "#f5f3ff", padding: "4px 10px", borderRadius: "6px", textDecoration: "none" }}>Join</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📅</div>
                <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600" }}>No upcoming sessions</p>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Sessions will appear here once mentees book with you.</p>
              </div>
            )}
          </div>

          {/* Messages placeholder — real messages need Socket.io */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Messages</h2>
              <Link to="/mentor/messages" style={{ fontSize: "12px", color: "#8b5cf6", textDecoration: "none", fontWeight: "600" }}>View all</Link>
            </div>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>💬</div>
              <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Messages coming soon</p>
              <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px", marginBottom: "16px" }}>Real-time chat with mentees will appear here.</p>
              <Link to="/mentor/messages" style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", textDecoration: "none", padding: "9px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px" }}>
                Open messages →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "14px" }}>Quick actions</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { label: "Set availability", path: "/mentor/availability", color: "#8b5cf6", bg: "#faf5ff" },
              { label: "Create roadmap", path: "/mentor/roadmaps", color: "#10b981", bg: "#f0fdf4" },
              { label: "Edit profile", path: "/mentor/profile/edit", color: "#6366f1", bg: "#eef2ff" },
              { label: "Update pricing", path: "/mentor/pricing", color: "#f59e0b", bg: "#fffbeb" },
              { label: "View earnings", path: "/mentor/earnings", color: "#10b981", bg: "#f0fdf4" },
            ].map(action => (
              <Link key={action.label} to={action.path} style={{ textDecoration: "none", padding: "10px 18px", borderRadius: "10px", background: action.bg, color: action.color, fontSize: "13px", fontWeight: "700", border: `1px solid ${action.color}22`, display: "inline-block" }}>
                {action.label} →
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
