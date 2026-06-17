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

const allNotifications = [
  { id: "1", title: "New session booked!", message: "Kofi Asante booked a session with you for tomorrow at 3:00 PM.", time: "2 hours ago", read: false, icon: "📅", color: "#8b5cf6" },
  { id: "2", title: "New message from Fatima Bello", message: "Can we discuss my portfolio before Thursday?", time: "3 hours ago", read: false, icon: "💬", color: "#10b981" },
  { id: "3", title: "New review received ⭐", message: "Blessing O. left you a 5-star review: 'Best investment I've made in my career.'", time: "Yesterday", read: false, icon: "⭐", color: "#f59e0b" },
  { id: "4", title: "Session cancelled", message: "Aisha D. cancelled her session scheduled for Friday at 7:00 PM.", time: "2 days ago", read: true, icon: "❌", color: "#ef4444" },
  { id: "5", title: "Payout processed", message: "Your payout of $80 has been processed and will arrive in 2-3 business days.", time: "3 days ago", read: true, icon: "💰", color: "#10b981" },
];

export default function MentorNotifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(allNotifications);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
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
      <div style={{ flex: 1, padding: "32px", maxWidth: "700px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Notifications {unread > 0 && <span style={{ marginLeft: "8px", background: "#8b5cf6", color: "white", fontSize: "12px", fontWeight: "700", padding: "2px 8px", borderRadius: "100px" }}>{unread}</span>}</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Stay on top of your sessions and mentee activity.</p>
          </div>
          {unread > 0 && <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{ background: "white", border: "1px solid #e5e7eb", color: "#8b5cf6", padding: "8px 16px", borderRadius: "9px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>Mark all read</button>}
        </div>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
          {notifications.map((n, i) => (
            <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ display: "flex", gap: "14px", padding: "16px 20px", background: n.read ? "white" : "#fafafe", borderLeft: `3px solid ${n.read ? "transparent" : n.color}`, borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${n.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: n.read ? "600" : "800", color: "#0f172a" }}>{n.title}</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>{n.message}</p>
              </div>
              {!n.read && <div style={{ width: "8px", height: "8px", background: n.color, borderRadius: "50%", flexShrink: 0, marginTop: "6px" }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}