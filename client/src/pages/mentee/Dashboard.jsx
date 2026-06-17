import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";

const stats = [
  { label: "Sessions booked", value: "3", icon: "📅", color: "#6366f1" },
  { label: "Mentors connected", value: "2", icon: "👥", color: "#10b981" },
  { label: "Roadmaps saved", value: "5", icon: "🗺️", color: "#f59e0b" },
  { label: "Unread messages", value: "4", icon: "💬", color: "#8b5cf6" },
];

const quickActions = [
  { label: "Find a mentor", path: "/explore", color: "#6366f1", bg: "#eef2ff" },
  { label: "Browse roadmaps", path: "/roadmaps", color: "#10b981", bg: "#f0fdf4" },
  { label: "My sessions", path: "/my-sessions", color: "#f59e0b", bg: "#fffbeb" },
  { label: "Messages", path: "/messages", color: "#8b5cf6", bg: "#faf5ff" },
];

const upcomingSession = {
  mentor: "Amara Okafor", role: "Software Engineer @ Google",
  avatar: "AO", color: "#6366f1", date: "Tomorrow", time: "3:00 PM",
  topic: "Breaking into tech — roadmap review", sessionId: "sess_001",
};

const recommendedMentors = [
  { name: "Tunde Adeyemi", role: "Product Manager @ Flutterwave", avatar: "TA", color: "#10b981", rating: 4.8, price: 20, field: "Product Management" },
  { name: "Chioma Eze", role: "UX Design Lead @ Microsoft", avatar: "CE", color: "#f59e0b", rating: 5.0, price: 30, field: "UI/UX Design" },
  { name: "Kwame Mensah", role: "Data Scientist @ MTN", avatar: "KM", color: "#8b5cf6", rating: 4.7, price: 15, field: "Data Science" },
];

const recentActivity = [
  { text: "Booked a session with Amara Okafor", time: "2 hours ago", icon: "📅" },
  { text: "Saved 'Frontend Developer Roadmap'", time: "Yesterday", icon: "🔖" },
  { text: "Sent a message to Tunde Adeyemi", time: "2 days ago", icon: "💬" },
  { text: "Completed career quiz", time: "3 days ago", icon: "🎯" },
];

const savedRoadmaps = [
  { title: "Frontend Developer Roadmap", mentor: "Amara Okafor", steps: 12, color: "#6366f1" },
  { title: "Breaking into Product Management", mentor: "Tunde Adeyemi", steps: 8, color: "#10b981" },
  { title: "UI/UX Design from scratch", mentor: "Chioma Eze", steps: 10, color: "#f59e0b" },
];

function ProgressBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "100px", transition: "width 0.5s ease" }} />
    </div>
  );
}

function DashboardContent() {
  const user = useSelector(selectUser);
  const sessionsUsed = 1;
  const sessionLimit = 3;

  // dummy onboarding data — will come from DB after onboarding is built
  const careerGoal = user?.careerGoal || null;
  const careerField = user?.careerField || null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ padding: "32px" }}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Here's what's happening with your mentorship journey.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{ position: "relative", background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px", cursor: "pointer" }}>
            <span style={{ fontSize: "18px" }}>🔔</span>
            <span style={{ position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />
          </button>
          <Link to="/settings" style={{ textDecoration: "none" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px" }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </Link>
        </div>
      </div>

      {/* ── CAREER GOAL BANNER ── */}
      {careerGoal ? (
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid rgba(99,102,241,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>🎯</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your career goal</span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "white", marginBottom: "6px" }}>{careerGoal}</h2>
              {careerField && <span style={{ fontSize: "12px", fontWeight: "600", color: "#6366f1", background: "rgba(99,102,241,0.15)", padding: "4px 10px", borderRadius: "6px" }}>{careerField}</span>}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/explore" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "700" }}>Book a session</Link>
              <Link to="/onboarding" style={{ background: "rgba(255,255,255,0.08)", color: "white", textDecoration: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.1)" }}>Edit goal</Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "32px" }}>🧭</span>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: "800", color: "white", marginBottom: "4px" }}>You haven't set your career goal yet</h2>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>Let's figure out exactly where you want to go and how to get you there. </p>
              </div>
            </div>
            <Link to="/onboarding" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
              Set my career goal →
            </Link>
          </div>
        </div>
      )}

      {/* ── STATS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px" }}>{stat.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: stat.color, background: `${stat.color}15`, padding: "3px 8px", borderRadius: "6px" }}>this month</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "14px" }}>Quick actions</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {quickActions.map((action) => (
            <Link key={action.label} to={action.path} style={{ textDecoration: "none", padding: "10px 18px", borderRadius: "10px", background: action.bg, color: action.color, fontSize: "13px", fontWeight: "700", border: `1px solid ${action.color}22`, display: "inline-block" }}>
              {action.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* ── ROW 1: Upcoming session + Recommended mentors ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Upcoming session */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Upcoming session</h2>
            <Link to="/my-sessions" style={{ fontSize: "12px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>View all</Link>
          </div>
          <div style={{ background: "#fafafa", borderRadius: "12px", padding: "16px", marginBottom: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `linear-gradient(135deg, ${upcomingSession.color}cc, ${upcomingSession.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
                {upcomingSession.avatar}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{upcomingSession.mentor}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{upcomingSession.role}</div>
              </div>
            </div>
            <div style={{ background: "#f0f0ff", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: "#6366f1", fontWeight: "600", marginBottom: "2px" }}>📅 {upcomingSession.date} at {upcomingSession.time}</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>{upcomingSession.topic}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to={`/session/${upcomingSession.sessionId}/room`} style={{ flex: 1, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textAlign: "center", textDecoration: "none", padding: "9px", borderRadius: "9px", fontWeight: "700", fontSize: "12px" }}>Join session</Link>
              <button style={{ flex: 1, background: "white", color: "#374151", border: "1px solid #e5e7eb", padding: "9px", borderRadius: "9px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>Reschedule</button>
            </div>
          </div>
          {/* Session goal progress */}
          <div style={{ background: "#fafafa", borderRadius: "12px", padding: "14px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151" }}>Monthly session goal</span>
              <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "700" }}>{sessionsUsed}/{sessionLimit} sessions</span>
            </div>
            <ProgressBar value={sessionsUsed} max={sessionLimit} color="linear-gradient(90deg, #6366f1, #8b5cf6)" />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
              {sessionLimit - sessionsUsed} sessions remaining on free plan ·{" "}
              <Link to="/subscription" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Upgrade to Pro</Link>
            </p>
          </div>
        </div>

        {/* Recommended mentors */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Recommended for you</h2>
            <Link to="/explore" style={{ fontSize: "12px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>See all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recommendedMentors.map((mentor) => (
              <div key={mentor.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `linear-gradient(135deg, ${mentor.color}cc, ${mentor.color}55)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px", flexShrink: 0 }}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{mentor.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{mentor.field}</div>
                    <div style={{ fontSize: "11px", color: "#f59e0b" }}>★ {mentor.rating}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: mentor.color, marginBottom: "6px" }}>${mentor.price}/session</div>
                  <Link to={`/book/${mentor.name}`} style={{ fontSize: "11px", fontWeight: "700", color: mentor.color, background: `${mentor.color}15`, padding: "4px 10px", borderRadius: "6px", textDecoration: "none" }}>Book</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Recent activity + Saved roadmaps ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Recent activity */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Recent activity</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: i < recentActivity.length - 1 ? "14px" : "0", marginBottom: i < recentActivity.length - 1 ? "14px" : "0", borderBottom: i < recentActivity.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "2px" }}>{item.text}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved roadmaps */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Saved roadmaps</h2>
            <Link to="/roadmaps" style={{ fontSize: "12px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Browse all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedRoadmaps.map((roadmap, i) => (
              <div key={i} style={{ padding: "14px", background: "#fafafa", borderRadius: "12px", borderLeft: `3px solid ${roadmap.color}`, border: `1px solid ${roadmap.color}22` }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a", marginBottom: "4px" }}>{roadmap.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>by {roadmap.mentor}</span>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: roadmap.color, background: `${roadmap.color}15`, padding: "2px 8px", borderRadius: "5px" }}>{roadmap.steps} steps</span>
                </div>
              </div>
            ))}
            <Link to="/roadmaps" style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: "10px", border: "1px dashed #e5e7eb", color: "#94a3b8", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
              + Discover more roadmaps
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function MenteeDashboard() {
  return (
    <MenteeLayout>
      <DashboardContent />
    </MenteeLayout>
  );
}
