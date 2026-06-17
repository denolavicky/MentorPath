import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { mentorsAPI, sessionsAPI } from "../../api/index.js";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

const sessionTopics = [
  "Career roadmap planning",
  "Portfolio / project review",
  "Mock interview preparation",
  "Skills gap analysis",
  "Job application strategy",
  "Breaking into the industry",
  "Other (describe below)",
];

const STEPS = ["Pick a date", "Pick a time", "Confirm booking"];

function nameColor(name = "") {
  const colors = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ef4444","#0ea5e9","#f97316","#14b8a6"];
  return colors[name.charCodeAt(0) % colors.length];
}

function initials(name = "") {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function StepIndicator({ currentStep, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done = currentStep > stepNum;
        const active = currentStep === stepNum;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: done || active ? color : "#f1f5f9", border: done || active ? "none" : "2px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                {done
                  ? <span style={{ color: "white", fontSize: "14px" }}>✓</span>
                  : <span style={{ fontSize: "13px", fontWeight: "700", color: active ? "white" : "#94a3b8" }}>{stepNum}</span>}
              </div>
              <span style={{ fontSize: "13px", fontWeight: active ? "700" : "500", color: active ? "#0f172a" : done ? "#64748b" : "#94a3b8", whiteSpace: "nowrap" }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: "2px", background: done ? color : "#f1f5f9", margin: "0 12px", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Calendar({ selectedDate, onSelect, color }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const isPast = (day) => new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (day) => selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  const isToday = (day) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isWeekend = (day) => { const d = new Date(viewYear, viewMonth, day).getDay(); return d === 0 || d === 6; };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button onClick={prevMonth} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "700", color: "#374151" }}>←</button>
        <span style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a" }}>{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "700", color: "#374151" }}>→</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
        {dayNames.map(d => <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "700", color: "#94a3b8", padding: "4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {cells.map((day, i) => (
          <div key={i}>
            {day ? (
              <button
                onClick={() => !isPast(day) && !isWeekend(day) && onSelect(new Date(viewYear, viewMonth, day))}
                disabled={isPast(day) || isWeekend(day)}
                style={{
                  width: "100%", aspectRatio: "1", borderRadius: "10px", border: "none",
                  background: isSelected(day) ? color : isToday(day) ? `${color}15` : "transparent",
                  color: isSelected(day) ? "white" : isPast(day) || isWeekend(day) ? "#d1d5db" : isToday(day) ? color : "#374151",
                  fontWeight: isSelected(day) || isToday(day) ? "800" : "500",
                  fontSize: "13px", cursor: isPast(day) || isWeekend(day) ? "not-allowed" : "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isPast(day) && !isWeekend(day) && !isSelected(day)) e.currentTarget.style.background = `${color}15`; }}
                onMouseLeave={e => { if (!isSelected(day)) e.currentTarget.style.background = isToday(day) ? `${color}15` : "transparent"; }}
              >
                {day}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>
      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "12px", textAlign: "center" }}>Weekends unavailable · Past dates disabled</p>
    </div>
  );
}

function BookSessionContent() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [bookError, setBookError] = useState(null);
  const [booked, setBooked] = useState(false);
  const [bookedSession, setBookedSession] = useState(null);

  // Fetch real mentor from API
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const res = await mentorsAPI.getById(mentorId);
        setMentor(res.data.mentor);
      } catch (err) {
        setError("Mentor not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [mentorId]);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  // Real booking — calls POST /api/sessions
  const handleConfirm = async () => {
    if (!selectedTopic) return;
    setConfirming(true);
    setBookError(null);
    try {
      const res = await sessionsAPI.book({
        mentorId: mentor._id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        topic: selectedTopic,
        note,
      });
      setBookedSession(res.data.session);
      setBooked(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to book session. Please try again.";
      setBookError(msg);
    } finally {
      setConfirming(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
        Loading mentor details...
      </div>
    );
  }

  // Mentor not found
  if (error || !mentor) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Mentor not found</h2>
        <Link to="/explore" style={{ color: "#6366f1", fontWeight: "700", textDecoration: "none" }}>← Back to explore</Link>
      </div>
    );
  }

  const color = nameColor(mentor.name);
  const appData = mentor.applicationData || {};

  // Success screen
  if (booked) {
    return (
      <div style={{ padding: "32px", maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "48px 32px", border: "1px solid #f1f5f9" }}>
          <div style={{ width: "72px", height: "72px", background: "linear-gradient(135deg, #10b981, #34d399)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "32px" }}>✓</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Session booked! 🎉</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
            Your session with <strong>{mentor.name}</strong> is confirmed for <strong>{formatDate(selectedDate)}</strong> at <strong>{selectedTime}</strong>.
          </p>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "28px", textAlign: "left" }}>
            <p style={{ fontSize: "13px", color: "#166534", fontWeight: "600", marginBottom: "4px" }}>📧 What's next?</p>
            <p style={{ fontSize: "13px", color: "#166534" }}>You'll receive a confirmation email with the session link. Your mentor will also be notified.</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/my-sessions" style={{ flex: 1, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textAlign: "center" }}>View my sessions</Link>
            <Link to="/dashboard" style={{ flex: 1, background: "white", color: "#374151", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "1px solid #e5e7eb", textAlign: "center" }}>Go to dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>

      {/* Back */}
      <Link to={`/mentors/${mentorId}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
        ← Back to profile
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Book a session</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px", overflow: "hidden" }}>
            {mentor.avatar
              ? <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials(mentor.name)}
          </div>
          <div>
            <span style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{mentor.name}</span>
            <span style={{ fontSize: "13px", color: "#64748b" }}> · {appData.jobTitle || "Mentor"}{appData.company ? ` @ ${appData.company}` : ""}</span>
          </div>
          <span style={{ marginLeft: "auto", fontSize: "16px", fontWeight: "800", color }}>${mentor.sessionPrice || 0}/session</span>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} color={color} />

      {/* Step 1 — Pick a date */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Choose a date</h2>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>Select a weekday that works for you.</p>
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} color={color} />
          {selectedDate && (
            <div style={{ marginTop: "16px", background: `${color}10`, border: `1px solid ${color}30`, borderRadius: "12px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>📅 {formatDate(selectedDate)}</span>
              <button onClick={() => setStep(2)} style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", border: "none", padding: "9px 20px", borderRadius: "9px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                Continue →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Pick a time */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Choose a time</h2>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>
            Available slots for <strong>{formatDate(selectedDate)}</strong>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", marginBottom: "24px" }}>
            {timeSlots.map(time => {
              const isSelected = selectedTime === time;
              return (
                <button key={time} onClick={() => setSelectedTime(time)} style={{
                  padding: "12px 8px", borderRadius: "12px",
                  border: isSelected ? `2px solid ${color}` : "2px solid #e5e7eb",
                  background: isSelected ? `${color}15` : "white",
                  color: isSelected ? color : "#374151",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
                }}>
                  {time}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setStep(1)} style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", padding: "11px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>← Back</button>
            {selectedTime && (
              <button onClick={() => setStep(3)} style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", border: "none", padding: "11px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                Continue →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Left — session details */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Session details</h2>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>What do you want to work on?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {sessionTopics.map(topic => (
                  <button key={topic} onClick={() => setSelectedTopic(topic)} style={{
                    padding: "11px 14px", borderRadius: "10px",
                    border: selectedTopic === topic ? `2px solid ${color}` : "2px solid #e5e7eb",
                    background: selectedTopic === topic ? `${color}10` : "white",
                    color: selectedTopic === topic ? color : "#374151",
                    fontWeight: "600", fontSize: "13px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    {topic}
                    {selectedTopic === topic && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                Additional notes <span style={{ color: "#94a3b8", fontWeight: "500" }}>(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. I'm a fresh graduate with 6 months of self-taught React experience looking to land my first job..."
                rows={4}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          </div>

          {/* Right — summary */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Booking summary</h2>
            <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px", overflow: "hidden" }}>
                  {mentor.avatar
                    ? <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : initials(mentor.name)}
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{mentor.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{appData.jobTitle || "Mentor"}</div>
                </div>
              </div>
              {[
                ["📅 Date", formatDate(selectedDate)],
                ["🕐 Time", selectedTime],
                ["⏱️ Duration", "60 minutes"],
                ["📋 Topic", selectedTopic || "Not selected yet"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "600", textAlign: "right", maxWidth: "180px" }}>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color }}>${mentor.sessionPrice || 0}</span>
              </div>
            </div>

            {/* Error message */}
            {bookError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600" }}>⚠️ {bookError}</p>
              </div>
            )}

            <div style={{ background: "#f0f0ff", border: "1px solid #e0e7ff", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: "#6366f1", fontWeight: "600", marginBottom: "2px" }}>🎁 Free plan</p>
              <p style={{ fontSize: "12px", color: "#4338ca" }}>This session uses 1 of your 3 free sessions this month.</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setStep(2)} style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", padding: "12px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>← Back</button>
              <button
                onClick={handleConfirm}
                disabled={!selectedTopic || confirming}
                style={{
                  flex: 1, background: !selectedTopic ? "#e5e7eb" : `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: !selectedTopic ? "#94a3b8" : "white", border: "none", padding: "12px", borderRadius: "10px",
                  fontWeight: "700", fontSize: "14px", cursor: !selectedTopic ? "not-allowed" : "pointer",
                  boxShadow: selectedTopic ? `0 4px 14px ${color}40` : "none",
                  opacity: confirming ? 0.7 : 1,
                }}
              >
                {confirming ? "Confirming..." : "Confirm booking 🎉"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookSession() {
  return (
    <MenteeLayout>
      <BookSessionContent />
    </MenteeLayout>
  );
}
