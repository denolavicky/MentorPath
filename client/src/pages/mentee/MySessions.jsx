import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { sessionsAPI } from "../../api/index.js";

const statusConfig = {
  confirmed: { label: "Upcoming", color: "#6366f1", bg: "#eef2ff" },
  completed: { label: "Completed", color: "#10b981", bg: "#f0fdf4" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fffbeb" },
};

// Generate a colour from mentor name so cards aren't grey
function nameColor(name = "") {
  const colors = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ef4444","#0ea5e9","#f97316","#14b8a6"];
  return colors[name.charCodeAt(0) % colors.length];
}

function initials(name = "") {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function SessionCard({ session, onCancel }) {
  const status = statusConfig[session.status] || statusConfig.pending;
  const isUpcoming = session.status === "confirmed" || session.status === "pending";
  const isCompleted = session.status === "completed";
  const mentor = session.mentor || {};
  const color = nameColor(mentor.name);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div
      style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>

        {/* Mentor info */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "13px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "15px", flexShrink: 0, overflow: "hidden" }}>
            {mentor.avatar
              ? <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials(mentor.name)}
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a", marginBottom: "2px" }}>{mentor.name || "Unknown mentor"}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>{mentor.careerField || "Mentor"}</div>
          </div>
        </div>

        {/* Status badge */}
        <span style={{ fontSize: "12px", fontWeight: "700", color: status.color, background: status.bg, padding: "4px 12px", borderRadius: "100px" }}>
          {status.label}
        </span>
      </div>

      {/* Session details */}
      <div style={{ display: "flex", gap: "20px", margin: "16px 0", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>📅</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{formatDate(session.date)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>🕐</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{session.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>💬</span>
          <span style={{ fontSize: "13px", color: "#64748b" }}>{session.topic}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>💰</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>${session.price || 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {isUpcoming && (
          <>
            <Link
              to={`/session-room/${session._id}`}
              style={{ padding: "9px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}
            >
              Join session →
            </Link>
            <button
              onClick={() => onCancel(session._id)}
              style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </>
        )}
        {isCompleted && !session.reviewLeft && (
          <Link
            to={`/review/${session._id}`}
            style={{ padding: "9px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}
          >
            ⭐ Leave a review
          </Link>
        )}
        {isCompleted && session.reviewLeft && (
          <span style={{ padding: "9px 18px", borderRadius: "10px", background: "#f0fdf4", color: "#10b981", fontWeight: "700", fontSize: "13px", border: "1px solid #bbf7d0" }}>
            ✅ Reviewed
          </span>
        )}
      </div>
    </div>
  );
}

function MySessionsContent() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await sessionsAPI.getMySessions();
        setSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleCancel = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this session?")) return;
    try {
      await sessionsAPI.cancel(sessionId);
      setSessions(prev =>
        prev.map(s => s._id === sessionId ? { ...s, status: "cancelled" } : s)
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel session. Please try again.");
    }
  };

  const filtered = filter === "all" ? sessions : sessions.filter(s => s.status === filter);
  const upcoming = sessions.filter(s => s.status === "confirmed" || s.status === "pending");
  const completed = sessions.filter(s => s.status === "completed");
  const totalSpent = completed.reduce((acc, s) => acc + (s.price || 0), 0);

  return (
    <div style={{ padding: "32px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>My Sessions</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Track your upcoming and past mentoring sessions.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Upcoming", value: upcoming.length, color: "#6366f1", icon: "📅" },
          { label: "Completed", value: completed.length, color: "#10b981", icon: "✅" },
          { label: "Total spent", value: `$${totalSpent}`, color: "#8b5cf6", icon: "💰" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "white", borderRadius: "14px", padding: "18px", border: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: stat.color, marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "all", label: "All sessions" },
          { key: "confirmed", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
              background: filter === tab.key ? "#6366f1" : "white",
              color: filter === tab.key ? "white" : "#64748b",
              border: filter === tab.key ? "none" : "1px solid #e5e7eb",
              boxShadow: filter === tab.key ? "0 2px 8px rgba(99,102,241,0.3)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          Loading your sessions...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "1px solid #fee2e2" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
          <p style={{ color: "#ef4444", fontWeight: "600" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: "16px", background: "#6366f1", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>Try again</button>
        </div>
      )}

      {/* Sessions list */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filtered.map(session => (
            <SessionCard key={session._id} session={session} onCancel={handleCancel} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No sessions found</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
            {filter === "all" ? "You haven't booked any sessions yet." : `No ${filter} sessions.`}
          </p>
          <Link to="/explore" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "11px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", display: "inline-block" }}>
            Find a mentor →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MySessions() {
  return (
    <MenteeLayout>
      <MySessionsContent />
    </MenteeLayout>
  );
}
