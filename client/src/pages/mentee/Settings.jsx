import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setCredentials, logout } from "../../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { usersAPI } from "../../api/index.js";

const tabs = ["Profile", "Career goals", "Password", "Account"];

function MenteeSettingsContent() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    careerField: user?.careerField || "",
  });

  const [goals, setGoals] = useState({
    careerGoal: user?.careerGoal || "",
    situation: user?.situation || "",
    timeline: user?.timeline || "",
    challenges: user?.challenges || [],
    helpNeeded: user?.helpNeeded || [],
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await usersAPI.updateProfile(profile);
      dispatch(setCredentials({ user: data.user, token: localStorage.getItem("token") }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGoals = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await usersAPI.updateProfile(goals);
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
      setError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
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

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      dispatch(logout());
      navigate("/");
    }
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder, disabled }) => (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", background: disabled ? "#f8fafc" : "white", color: disabled ? "#94a3b8" : "#0f172a" }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = "#6366f1"; }}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "700px" }}>

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Settings</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Manage your account and preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", border: "1px solid #f1f5f9", marginBottom: "24px", width: "fit-content" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setError(""); setSaved(false); }} style={{ padding: "8px 18px", borderRadius: "9px", border: "none", cursor: "pointer", background: activeTab === tab ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent", color: activeTab === tab ? "white" : "#64748b", fontWeight: "700", fontSize: "13px", transition: "all 0.2s" }}>
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {saved && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px", fontWeight: "600" }}>
          ✓ Changes saved successfully!
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {activeTab === "Profile" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Personal information</h2>

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", padding: "16px", background: "#fafafa", borderRadius: "12px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "22px", flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>Profile photo</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>JPG, PNG up to 2MB</p>
              <button style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>
                Upload photo
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Full name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Your full name" />
            <InputField label="Email address" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} type="email" placeholder="your@email.com" disabled />
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell mentors a bit about yourself..." rows={3}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={saving} style={{ marginTop: "20px", background: saving ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}

      {/* ── CAREER GOALS TAB ── */}
      {activeTab === "Career goals" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Your career goals</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Keeping this updated helps us recommend the right mentors for you.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Career field" value={goals.careerField} onChange={v => setGoals(g => ({ ...g, careerField: v }))} placeholder="e.g. Software Engineering" />
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Your goal</label>
              <textarea value={goals.careerGoal} onChange={e => setGoals(g => ({ ...g, careerGoal: e.target.value }))} placeholder='e.g. "Land a frontend developer role by mid-2025"' rows={3}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Current situation</label>
              <select value={goals.situation} onChange={e => setGoals(g => ({ ...g, situation: e.target.value }))} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                <option value="">Select your situation</option>
                {["I'm currently a student", "I just graduated", "I'm switching careers", "I have no experience yet", "I'm self-taught"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Target timeline</label>
              <select value={goals.timeline} onChange={e => setGoals(g => ({ ...g, timeline: e.target.value }))} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                <option value="">Select timeline</option>
                {["As soon as possible", "Within 3 months", "Within 6 months", "Within 1 year", "I'm not sure yet"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleSaveGoals} disabled={saving} style={{ marginTop: "20px", background: saving ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save goals"}
          </button>
        </div>
      )}

      {/* ── PASSWORD TAB ── */}
      {activeTab === "Password" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Change password</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField label="Current password" value={passwords.currentPassword} onChange={v => setPasswords(p => ({ ...p, currentPassword: v }))} type="password" placeholder="Enter current password" />
            <InputField label="New password" value={passwords.newPassword} onChange={v => setPasswords(p => ({ ...p, newPassword: v }))} type="password" placeholder="At least 6 characters" />
            <InputField label="Confirm new password" value={passwords.confirmPassword} onChange={v => setPasswords(p => ({ ...p, confirmPassword: v }))} type="password" placeholder="Re-enter new password" />
          </div>
          <button onClick={handleChangePassword} disabled={saving || !passwords.currentPassword || !passwords.newPassword} style={{ marginTop: "20px", background: (!passwords.currentPassword || !passwords.newPassword) ? "#e5e7eb" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: (!passwords.currentPassword || !passwords.newPassword) ? "#94a3b8" : "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: (!passwords.currentPassword || !passwords.newPassword) ? "not-allowed" : "pointer" }}>
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      )}

      {/* ── ACCOUNT TAB ── */}
      {activeTab === "Account" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Subscription */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Subscription</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#fafafa", borderRadius: "12px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", marginBottom: "2px" }}>
                  {user?.subscriptionStatus === "pro" ? "Pro Plan" : "Free Plan"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {user?.subscriptionStatus === "pro" ? "Unlimited sessions per month" : "3 sessions per month"}
                </div>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: user?.subscriptionStatus === "pro" ? "#8b5cf6" : "#64748b", background: user?.subscriptionStatus === "pro" ? "#f5f3ff" : "#f8fafc", padding: "4px 12px", borderRadius: "8px" }}>
                {user?.subscriptionStatus === "pro" ? "Pro" : "Free"}
              </span>
            </div>
            {user?.subscriptionStatus !== "pro" && (
              <button style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                Upgrade to Pro →
              </button>
            )}
          </div>

          {/* Danger zone */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #fecaca" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#ef4444", marginBottom: "8px" }}>Danger zone</h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Once you delete your account all your data will be permanently removed. This cannot be undone.</p>
            <button onClick={handleDeleteAccount} style={{ background: "white", border: "2px solid #ef4444", color: "#ef4444", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Delete my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenteeSettings() {
  return (
    <MenteeLayout>
      <MenteeSettingsContent />
    </MenteeLayout>
  );
}
