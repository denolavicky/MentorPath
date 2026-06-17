import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";

// Reuse MentorLayout pattern inline
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

import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/authSlice.js";

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
          <span style={{ fontSize: "16px" }}>🚪</span>
          {!collapsed && <span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>}
        </button>
      </div>
    </div>
  );
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

const defaultSchedule = {
  Monday: { enabled: true, slots: ["6:00 PM", "7:00 PM", "8:00 PM"] },
  Tuesday: { enabled: false, slots: [] },
  Wednesday: { enabled: true, slots: ["6:00 PM", "7:00 PM"] },
  Thursday: { enabled: false, slots: [] },
  Friday: { enabled: true, slots: ["5:00 PM", "6:00 PM", "7:00 PM"] },
  Saturday: { enabled: true, slots: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"] },
  Sunday: { enabled: false, slots: [] },
};

function AvailabilityContent() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [bufferTime, setBufferTime] = useState(15);
  const [maxPerDay, setMaxPerDay] = useState(3);

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled, slots: !prev[day].enabled ? [] : prev[day].slots },
    }));
  };

  const toggleSlot = (day, slot) => {
    setSchedule(prev => {
      const current = prev[day].slots;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot],
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: await mentorsAPI.setAvailability({ schedule, sessionDuration, bufferTime, maxPerDay });
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalSlots = Object.values(schedule).reduce((acc, day) => acc + day.slots.length, 0);
  const activeDays = Object.values(schedule).filter(d => d.enabled && d.slots.length > 0).length;

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Set your availability</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Choose when you're available for mentoring sessions each week.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#a5b4fc" : "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.3)", display: "flex", alignItems: "center", gap: "8px" }}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save availability"}
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Active days", value: activeDays, icon: "📅", color: "#8b5cf6" },
          { label: "Total time slots", value: totalSlots, icon: "🕐", color: "#6366f1" },
          { label: "Max sessions/day", value: maxPerDay, icon: "📋", color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Session settings */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Session settings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Session duration</label>
            <select value={sessionDuration} onChange={e => setSessionDuration(Number(e.target.value))} style={{ width: "100%", padding: "9px 12px", borderRadius: "9px", border: "2px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white" }}>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Buffer between sessions</label>
            <select value={bufferTime} onChange={e => setBufferTime(Number(e.target.value))} style={{ width: "100%", padding: "9px 12px", borderRadius: "9px", border: "2px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white" }}>
              <option value={0}>No buffer</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Max sessions per day</label>
            <select value={maxPerDay} onChange={e => setMaxPerDay(Number(e.target.value))} style={{ width: "100%", padding: "9px 12px", borderRadius: "9px", border: "2px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white" }}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} session{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Weekly schedule */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {days.map(day => {
          const dayData = schedule[day];
          const isWeekend = day === "Saturday" || day === "Sunday";
          return (
            <div key={day} style={{ background: "white", borderRadius: "14px", border: `1px solid ${dayData.enabled ? "#e0e7ff" : "#f1f5f9"}`, overflow: "hidden", transition: "all 0.2s" }}>
              {/* Day header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: dayData.enabled ? "#fafafe" : "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Toggle */}
                  <button onClick={() => toggleDay(day)} style={{ width: "40px", height: "22px", borderRadius: "100px", background: dayData.enabled ? "#8b5cf6" : "#e5e7eb", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "3px", left: dayData.enabled ? "21px" : "3px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: dayData.enabled ? "#0f172a" : "#94a3b8" }}>{day}</span>
                  {isWeekend && <span style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", background: "#f8fafc", padding: "2px 6px", borderRadius: "4px" }}>Weekend</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {dayData.enabled && dayData.slots.length > 0 && (
                    <span style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: "600", background: "#f5f3ff", padding: "3px 10px", borderRadius: "6px" }}>
                      {dayData.slots.length} slot{dayData.slots.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {dayData.enabled && dayData.slots.length === 0 && (
                    <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>No slots selected</span>
                  )}
                  {!dayData.enabled && (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Unavailable</span>
                  )}
                </div>
              </div>

              {/* Time slots */}
              {dayData.enabled && (
                <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", marginBottom: "10px" }}>Select available time slots:</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {timeSlots.map(slot => {
                      const selected = dayData.slots.includes(slot);
                      return (
                        <button key={slot} onClick={() => toggleSlot(day, slot)} style={{ padding: "6px 12px", borderRadius: "8px", border: selected ? "2px solid #8b5cf6" : "2px solid #e5e7eb", background: selected ? "#f5f3ff" : "white", color: selected ? "#8b5cf6" : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save button bottom */}
      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving} style={{ background: saving ? "#a5b4fc" : "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "13px 32px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.3)" }}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save availability"}
        </button>
      </div>
    </div>
  );
}

export default function Availability() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <AvailabilityContent />
      </div>
    </div>
  );
}
