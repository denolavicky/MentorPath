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

export default function RoadmapBuilder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");
  const [steps, setSteps] = useState([{ title: "", duration: "" }]);
  const [saved, setSaved] = useState(false);

  const addStep = () => setSteps(prev => [...prev, { title: "", duration: "" }]);
  const updateStep = (i, key, val) => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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

      <div style={{ flex: 1, padding: "32px", maxWidth: "700px", overflowY: "auto" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Roadmap Builder</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>Create a step-by-step career guide for your mentees.</p>
        {saved && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>✓ Roadmap saved!</div>}
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Roadmap details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[["Title", title, setTitle, "e.g. Frontend Developer Roadmap"], ["Description", description, setDescription, "What will mentees learn from this roadmap?"]].map(([label, val, setter, placeholder]) => (
              <div key={label}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>{label}</label>
                {label === "Description" ? (
                  <textarea value={val} onChange={e => setter(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                ) : (
                  <input value={val} onChange={e => setter(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                )}
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Career field</label>
              <select value={field} onChange={e => setField(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                <option value="">Select field</option>
                {["Software Engineering", "Product Management", "UI/UX Design", "Data Science", "Cybersecurity", "DevOps / Cloud", "Digital Marketing", "Finance & Fintech"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Steps ({steps.length})</h2>
            <button onClick={addStep} style={{ background: "#f5f3ff", border: "1px solid #e0d9ff", color: "#8b5cf6", padding: "7px 14px", borderRadius: "8px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>+ Add step</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "14px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px", flexShrink: 0, marginTop: "6px" }}>{i + 1}</div>
                <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                  <input value={step.title} onChange={e => updateStep(i, "title", e.target.value)} placeholder={`Step ${i + 1} title`} style={{ flex: 1, padding: "9px 12px", borderRadius: "8px", border: "2px solid #e5e7eb", fontSize: "13px", outline: "none" }} onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  <input value={step.duration} onChange={e => updateStep(i, "duration", e.target.value)} placeholder="Duration" style={{ width: "100px", padding: "9px 12px", borderRadius: "8px", border: "2px solid #e5e7eb", fontSize: "13px", outline: "none" }} onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                {steps.length > 1 && <button onClick={() => removeStep(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px", padding: "4px", marginTop: "4px" }}>✕</button>}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSave} style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "13px 32px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.3)" }}>
          Publish roadmap 🗺️
        </button>
      </div>
    </div>
  );
}