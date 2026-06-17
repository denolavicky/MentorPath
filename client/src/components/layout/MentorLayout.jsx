import { useState, useEffect } from "react";
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

const bottomNavItems = [
  { icon: "⊞", label: "Home", path: "/mentor/dashboard" },
  { icon: "📅", label: "Sessions", path: "/mentor/sessions" },
  { icon: "💬", label: "Messages", path: "/mentor/messages" },
  { icon: "💰", label: "Earnings", path: "/mentor/earnings" },
  { icon: "👤", label: "Profile", path: "/mentor/profile/edit" },
];

function Sidebar({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  return (
    <div style={{
      width: collapsed ? "64px" : "240px",
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {!collapsed && (
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>MentorPath</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "18px", padding: "4px", marginLeft: collapsed ? "auto" : "0", marginRight: collapsed ? "auto" : "0" }}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px", flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: "700", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Mentor"}</div>
              <div style={{ color: "#10b981", fontSize: "11px", fontWeight: "600" }}>✓ Verified Mentor</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px", marginBottom: "2px",
              textDecoration: "none",
              background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
              border: isActive ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
              transition: "all 0.15s",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#c4b5fd" : "#94a3b8", whiteSpace: "nowrap" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => { dispatch(logout()); navigate("/login"); }}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <span style={{ fontSize: "16px" }}>🚪</span>
          {!collapsed && <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>}
        </button>
      </div>
    </div>
  );
}

function MobileTopBar() {
  const user = useSelector(selectUser);
  const location = useLocation();
  const currentPage = navItems.find(item => item.path === location.pathname)?.label || "MentorPath";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "white", borderBottom: "1px solid #f1f5f9",
      padding: "0 16px", height: "56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "26px", height: "26px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: "12px", fontWeight: "800" }}>M</span>
        </div>
        <span style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{currentPage}</span>
      </div>
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>
        {user?.name?.charAt(0).toUpperCase() || "M"}
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const location = useLocation();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "white", borderTop: "1px solid #f1f5f9",
      display: "flex", alignItems: "center",
      paddingBottom: "env(safe-area-inset-bottom)",
      boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
    }}>
      {bottomNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "10px 4px 8px",
            textDecoration: "none", gap: "3px",
            borderTop: isActive ? "2px solid #8b5cf6" : "2px solid transparent",
          }}>
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span style={{ fontSize: "10px", fontWeight: isActive ? "700" : "500", color: isActive ? "#8b5cf6" : "#94a3b8" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function MentorLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
        <MobileTopBar />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "70px" }}>
          {children}
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
