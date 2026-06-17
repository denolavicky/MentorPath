import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setCredentials, logout } from "../../store/slices/authSlice.js";
import { usersAPI, mentorsAPI } from "../../api/index.js";

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

const skillOptions = ["React", "Node.js", "Python", "System Design", "TypeScript", "AWS", "Docker", "Figma", "User Research", "Product Strategy", "Agile", "Data Analysis", "Machine Learning", "SQL", "Cybersecurity", "DevOps", "Leadership", "Communication"];

const tabs = ["Public profile", "Password", "Account"];

function EditProfileContent() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Public profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    careerField: user?.careerField || "",
    experience: user?.experience || "",
    linkedIn: user?.linkedIn || "",
    website: user?.website || "",
    skills: user?.skills || [],
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await usersAPI.updateProfile(profile);
      dispatch(setCredentials({ user: data.user, token: localStorage.getItem("token") }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await usersAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setSaved(true);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "700px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Edit profile</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Update your public mentor profile and account settings.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", border: "1px solid #f1f5f9", marginBottom: "24px", width: "fit-content" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setError(""); setSaved(false); }} style={{ padding: "8px 18px", borderRadius: "9px", border: "none", cursor: "pointer", background: activeTab === tab ? "linear-gradient(135deg, #8b5cf6, #a78bfa)" : "transparent", color: activeTab === tab ? "white" : "#64748b", fontWeight: "700", fontSize: "13px", transition: "all 0.2s" }}>
            {tab}
          </button>
        ))}
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>{error}</div>}
      {saved && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px", fontWeight: "600" }}>✓ Changes saved!</div>}

      {/* ── PUBLIC PROFILE ── */}
      {activeTab === "Public profile" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Public profile</h2>

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", padding: "16px", background: "#fafafa", borderRadius: "12px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "22px", flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>Profile photo</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>This shows on your public mentor profile</p>
              <button style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>Upload photo</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Full name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Your full name" />

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell mentees about your background and what you can help with..." rows={4}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{profile.bio.length} characters</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Career field</label>
                <select value={profile.careerField} onChange={e => setProfile(p => ({ ...p, careerField: e.target.value }))} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                  <option value="">Select field</option>
                  {["Software Engineering", "Product Management", "UI/UX Design", "Data Science", "Cybersecurity", "DevOps / Cloud", "Digital Marketing", "Finance & Fintech"].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Years of experience</label>
                <select value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                  <option value="">Select</option>
                  {["1-2 years", "3-4 years", "5-7 years", "8-10 years", "10+ years"].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <InputField label="LinkedIn URL" value={profile.linkedIn} onChange={v => setProfile(p => ({ ...p, linkedIn: v }))} placeholder="https://linkedin.com/in/yourname" />
            <InputField label="Website / Portfolio" value={profile.website} onChange={v => setProfile(p => ({ ...p, website: v }))} placeholder="https://yourwebsite.com" />

            {/* Skills */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Skills & expertise</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {skillOptions.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{ padding: "6px 14px", borderRadius: "8px", border: profile.skills.includes(skill) ? "2px solid #8b5cf6" : "2px solid #e5e7eb", background: profile.skills.includes(skill) ? "#f5f3ff" : "white", color: profile.skills.includes(skill) ? "#8b5cf6" : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={handleSaveProfile} disabled={saving} style={{ background: saving ? "#a5b4fc" : "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Saving..." : "Save profile"}
            </button>
            <Link to={`/mentors/preview`} style={{ padding: "12px 20px", borderRadius: "10px", border: "1px solid #e5e7eb", color: "#374151", textDecoration: "none", fontWeight: "600", fontSize: "14px", display: "inline-block" }}>
              Preview profile
            </Link>
          </div>
        </div>
      )}

      {/* ── PASSWORD ── */}
      {activeTab === "Password" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Change password</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Current password" value={passwords.currentPassword} onChange={v => setPasswords(p => ({ ...p, currentPassword: v }))} type="password" placeholder="Enter current password" />
            <InputField label="New password" value={passwords.newPassword} onChange={v => setPasswords(p => ({ ...p, newPassword: v }))} type="password" placeholder="At least 6 characters" />
            <InputField label="Confirm new password" value={passwords.confirmPassword} onChange={v => setPasswords(p => ({ ...p, confirmPassword: v }))} type="password" placeholder="Re-enter new password" />
          </div>
          <button onClick={handleChangePassword} disabled={saving} style={{ marginTop: "20px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      )}

      {/* ── ACCOUNT ── */}
      {activeTab === "Account" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Account info</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[["Email", user?.email], ["Role", "Mentor"], ["Status", user?.mentorStatus], ["Member since", new Date(user?.createdAt || Date.now()).toLocaleDateString("en-GB", { month: "long", year: "numeric" })]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: "700", textTransform: "capitalize" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #fecaca" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#ef4444", marginBottom: "8px" }}>Danger zone</h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Deleting your account will remove all your sessions, earnings history, and profile permanently.</p>
            <button onClick={() => { if (window.confirm("Delete your account? This cannot be undone.")) { dispatch(logout()); navigate("/"); } }} style={{ background: "white", border: "2px solid #ef4444", color: "#ef4444", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Delete my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditMentorProfile() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <EditProfileContent />
      </div>
    </div>
  );
}
