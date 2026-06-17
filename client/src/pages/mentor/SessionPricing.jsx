import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setCredentials, logout } from "../../store/slices/authSlice.js";
import { mentorsAPI } from "../../api/index.js";

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

const presetPrices = [
  { value: 0, label: "Free", desc: "Great for building your first reviews", badge: null },
  { value: 10, label: "$10", desc: "Entry level — just starting out", badge: null },
  { value: 15, label: "$15", desc: "Affordable — 1-3 years experience", badge: null },
  { value: 20, label: "$20", desc: "Standard — 3-5 years experience", badge: "Popular" },
  { value: 25, label: "$25", desc: "Professional — 5+ years experience", badge: "Most booked" },
  { value: 30, label: "$30", desc: "Senior — lead/staff level", badge: null },
  { value: 35, label: "$35", desc: "Expert — 10+ years or niche skills", badge: null },
  { value: -1, label: "Custom", desc: "Set your own price", badge: null },
];

function PricingContent() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [price, setPrice] = useState(user?.sessionPrice || 25);
  const [customPrice, setCustomPrice] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const platformCut = Math.round(price * 0.2);
  const yourEarnings = price - platformCut;

  const handleSelect = (p) => {
    if (p === -1) {
      setIsCustom(true);
      setPrice(0);
    } else {
      setIsCustom(false);
      setPrice(p);
    }
  };

  const handleCustomChange = (val) => {
    const num = parseInt(val) || 0;
    setCustomPrice(val);
    setPrice(num);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await mentorsAPI.updatePricing({ sessionPrice: price });
      dispatch(setCredentials({ user: { ...user, sessionPrice: price }, token: localStorage.getItem("token") }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save pricing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "700px" }}>

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Session pricing</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Set how much you charge per 60-minute session.</p>
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>{error}</div>}
      {saved && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px", fontWeight: "600" }}>✓ Pricing updated successfully!</div>}

      {/* Live preview card */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid rgba(139,92,246,0.3)" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Live earnings preview</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "Mentee pays", value: price === 0 ? "Free" : `$${price}`, color: "white" },
            { label: "Platform fee (20%)", value: price === 0 ? "$0" : `-$${platformCut}`, color: "#ef4444" },
            { label: "You receive", value: price === 0 ? "$0" : `$${yourEarnings}`, color: "#10b981" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: item.color, marginBottom: "4px" }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{item.label}</div>
            </div>
          ))}
        </div>
        {price > 0 && (
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "14px", textAlign: "center" }}>
            At {price > 0 ? `$${price}/session` : "free"}, you'd earn <strong style={{ color: "#10b981" }}>${yourEarnings * 10}/month</strong> with just 10 sessions.
          </p>
        )}
      </div>

      {/* Price selector */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Choose your price</h2>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>You can change this at any time. New bookings will use the updated price.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {presetPrices.map(p => {
            const isSelected = p.value === -1 ? isCustom : (!isCustom && price === p.value);
            return (
              <button key={p.value} onClick={() => handleSelect(p.value)} style={{ padding: "14px 10px", borderRadius: "12px", border: isSelected ? "2px solid #8b5cf6" : "2px solid #e5e7eb", background: isSelected ? "#f5f3ff" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s", position: "relative" }}>
                {p.badge && (
                  <div style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", background: p.badge === "Most booked" ? "#10b981" : "#8b5cf6", color: "white", fontSize: "9px", fontWeight: "800", padding: "2px 8px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ fontSize: "16px", fontWeight: "800", color: isSelected ? "#8b5cf6" : "#0f172a", marginBottom: "4px" }}>{p.label}</div>
                <div style={{ fontSize: "10px", color: "#94a3b8", lineHeight: "1.4" }}>{p.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Custom price input */}
        {isCustom && (
          <div style={{ padding: "16px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Enter your custom price (USD)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#374151" }}>$</span>
              <input
                type="number" value={customPrice} onChange={e => handleCustomChange(e.target.value)}
                placeholder="0" min="0" max="500"
                style={{ width: "120px", padding: "10px 14px", borderRadius: "10px", fontSize: "18px", fontWeight: "800", border: "2px solid #8b5cf6", outline: "none", textAlign: "center" }}
              />
              <span style={{ fontSize: "14px", color: "#64748b" }}>per session</span>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>💡 Pricing tips</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { icon: "🆕", text: "New mentors should start free or low ($10-15) to build reviews quickly. Raise your price once you have 5+ reviews." },
            { icon: "⭐", text: "Mentors with 4.8+ ratings and 20+ sessions typically charge $25-35 and get more bookings." },
            { icon: "📈", text: "You can raise your price at any time. Existing bookings won't be affected — only new ones." },
            { icon: "🌍", text: "Consider your mentee's location. $25 is very affordable for some, and a stretch for others in Nigeria or Ghana." },
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{tip.icon}</span>
              <span style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#a5b4fc" : "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "13px 32px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.3)" }}>
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save pricing"}
      </button>
    </div>
  );
}

export default function SessionPricing() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <PricingContent />
      </div>
    </div>
  );
}
