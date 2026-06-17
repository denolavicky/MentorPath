import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../../store/slices/authSlice.js";
import { adminAPI } from "../../api/index.js";

const navItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin" },
  { icon: "👥", label: "Applications", path: "/admin/applications" },
  { icon: "👤", label: "Users", path: "/admin/users" },
  { icon: "📅", label: "Sessions", path: "/admin/sessions" },
  { icon: "💰", label: "Revenue", path: "/admin/revenue" },
  { icon: "🛡️", label: "Moderation", path: "/admin/moderation" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  return (
    <div style={{ width: "220px", minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "white" }}>Admin Panel</span>
        </Link>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px" }}>
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "12px" }}>{user?.name || "Admin"}</div>
            <div style={{ color: "#64748b", fontSize: "10px" }}>Platform Admin</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map(item => {
          const isActive = window.location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", textDecoration: "none", background: isActive ? "rgba(245,158,11,0.15)" : "transparent", border: isActive ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#fbbf24" : "#94a3b8" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer" }}>
          <span>🚪</span>
          <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <span style={{ fontSize: "24px" }}>{icon}</span>
        {sub && (
          <span style={{ fontSize: "11px", fontWeight: "600", color, background: `${color}15`, padding: "3px 8px", borderRadius: "6px" }}>{sub}</span>
        )}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{label}</div>
    </div>
  );
}

const quickActions = [
  { label: "Review applications", path: "/admin/applications", color: "#f59e0b", icon: "📝" },
  { label: "Manage users", path: "/admin/users", color: "#6366f1", icon: "👥" },
  { label: "View sessions", path: "/admin/sessions", color: "#10b981", icon: "📅" },
  { label: "Check revenue", path: "/admin/revenue", color: "#8b5cf6", icon: "💰" },
];

export default function AdminDashboard() {
  const user = useSelector(selectUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminAPI.getDashboard();
        setStats(res.data.stats);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Here's what's happening on MentorPath today.</p>
          </div>
          {stats?.pendingApplications > 0 && (
            <Link to="/admin/applications" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", textDecoration: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              ⏳ {stats.pendingApplications} pending application{stats.pendingApplications !== 1 ? "s" : ""}
            </Link>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px" }}>
            <p style={{ color: "#dc2626", fontWeight: "600", fontSize: "13px" }}>⚠️ {error}</p>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {loading ? (
            // Skeleton placeholders
            Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#e2e8f0", fontSize: "13px" }}>Loading...</span>
              </div>
            ))
          ) : stats ? (
            <>
              <StatCard label="Total users" value={stats.totalUsers} icon="👤" color="#6366f1" sub="all time" />
              <StatCard label="Active mentors" value={stats.totalMentors} icon="🌟" color="#10b981" sub="approved" />
              <StatCard label="Total mentees" value={stats.totalMentees} icon="🎓" color="#f59e0b" sub="registered" />
              <StatCard label="Total sessions" value={stats.totalSessions} icon="📅" color="#8b5cf6" sub="all time" />
              <StatCard
                label="Pending applications"
                value={stats.pendingApplications}
                icon="⏳"
                color="#ef4444"
                sub={stats.pendingApplications > 0 ? "needs review" : "all clear"}
              />
              <StatCard label="Platform status" value="Live" icon="✅" color="#10b981" sub="operational" />
            </>
          ) : null}
        </div>

        {/* Quick actions */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "14px" }}>Quick actions</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {quickActions.map(action => (
              <Link key={action.label} to={action.path} style={{ textDecoration: "none", padding: "10px 18px", borderRadius: "10px", background: `${action.color}10`, color: action.color, fontSize: "13px", fontWeight: "700", border: `1px solid ${action.color}22`, display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{action.icon}</span>
                {action.label}
                {action.label === "Review applications" && stats?.pendingApplications > 0 && (
                  <span style={{ background: action.color, color: "white", fontSize: "10px", fontWeight: "800", padding: "1px 6px", borderRadius: "100px" }}>{stats.pendingApplications}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Summary cards */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Platform overview</h2>
            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Loading...</p>
            ) : stats ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Total registered users", value: stats.totalUsers, color: "#6366f1" },
                  { label: "Approved mentors", value: stats.totalMentors, color: "#10b981" },
                  { label: "Mentees on platform", value: stats.totalMentees, color: "#f59e0b" },
                  { label: "Sessions booked", value: stats.totalSessions, color: "#8b5cf6" },
                  { label: "Applications pending", value: stats.pendingApplications, color: "#ef4444" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{item.label}</span>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#ef4444", fontSize: "13px" }}>Could not load stats.</p>
            )}
          </div>

          {/* Admin links */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Admin tools</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Review mentor applications", path: "/admin/applications", color: "#f59e0b", icon: "📝", desc: "Approve or reject pending applications" },
                { label: "Manage all users", path: "/admin/users", color: "#6366f1", icon: "👥", desc: "Edit roles, ban users, view profiles" },
                { label: "Sessions overview", path: "/admin/sessions", color: "#10b981", icon: "📅", desc: "See all booked and completed sessions" },
                { label: "Revenue & payments", path: "/admin/revenue", color: "#8b5cf6", icon: "💰", desc: "Track earnings and payouts" },
                { label: "Analytics", path: "/admin/analytics", color: "#0ea5e9", icon: "📊", desc: "Growth, retention, and usage stats" },
                { label: "Platform settings", path: "/admin/settings", color: "#64748b", icon: "⚙️", desc: "Configure platform-wide settings" },
              ].map(link => (
                <Link key={link.path} to={link.path} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #f1f5f9", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${link.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: link.color }}>{link.label}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{link.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#cbd5e1", fontSize: "14px" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
