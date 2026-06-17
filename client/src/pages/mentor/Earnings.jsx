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

const transactions = [
  { id: "1", mentee: "Kofi Asante", avatar: "KA", color: "#6366f1", topic: "Career roadmap planning", date: "Today", amount: 25, platformCut: 5, payout: 20, status: "pending" },
  { id: "2", mentee: "Fatima Bello", avatar: "FB", color: "#10b981", topic: "Portfolio review", date: "Yesterday", amount: 25, platformCut: 5, payout: 20, status: "paid" },
  { id: "3", mentee: "David Osei", avatar: "DO", color: "#f59e0b", topic: "Mock interview prep", date: "3 days ago", amount: 25, platformCut: 5, payout: 20, status: "paid" },
  { id: "4", mentee: "Blessing O.", avatar: "BO", color: "#8b5cf6", topic: "Breaking into the industry", date: "1 week ago", amount: 25, platformCut: 5, payout: 20, status: "paid" },
  { id: "5", mentee: "Emeka N.", avatar: "EN", color: "#ef4444", topic: "Skills gap analysis", date: "2 weeks ago", amount: 25, platformCut: 5, payout: 20, status: "paid" },
  { id: "6", mentee: "Aisha D.", avatar: "AD", color: "#0ea5e9", topic: "Job application strategy", date: "3 weeks ago", amount: 25, platformCut: 5, payout: 20, status: "paid" },
];

const monthlyData = [
  { month: "Aug", sessions: 4, earnings: 80 },
  { month: "Sep", sessions: 6, earnings: 120 },
  { month: "Oct", sessions: 8, earnings: 160 },
  { month: "Nov", sessions: 10, earnings: 200 },
  { month: "Dec", sessions: 9, earnings: 180 },
  { month: "Jan", sessions: 12, earnings: 240 },
];

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.earnings));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px", padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#8b5cf6" }}>${d.earnings}</span>
          <div style={{ width: "100%", background: i === data.length - 1 ? "linear-gradient(180deg, #8b5cf6, #a78bfa)" : "#e0e7ff", borderRadius: "6px 6px 0 0", height: `${(d.earnings / max) * 80}px`, transition: "height 0.5s ease", minHeight: "4px" }} />
          <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function EarningsContent() {
  const [period, setPeriod] = useState("this month");

  const totalEarned = transactions.reduce((acc, t) => acc + t.payout, 0);
  const pendingPayout = transactions.filter(t => t.status === "pending").reduce((acc, t) => acc + t.payout, 0);
  const thisMonth = transactions.filter(t => ["Today", "Yesterday", "3 days ago"].includes(t.date)).reduce((acc, t) => acc + t.payout, 0);

  return (
    <div style={{ padding: "32px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Earnings</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Track your session revenue and payouts.</p>
        </div>
        <button style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
          Request payout →
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total earned", value: `$${totalEarned}`, sub: "all time", color: "#8b5cf6", icon: "💰" },
          { label: "This month", value: `$${thisMonth}`, sub: "3 sessions", color: "#6366f1", icon: "📅" },
          { label: "Pending payout", value: `$${pendingPayout}`, sub: "processing", color: "#f59e0b", icon: "⏳" },
          { label: "Total sessions", value: transactions.length, sub: "completed", color: "#10b981", icon: "✅" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "22px" }}>{s.icon}</span>
              <span style={{ fontSize: "11px", color: s.color, fontWeight: "600", background: `${s.color}15`, padding: "2px 8px", borderRadius: "6px" }}>{s.sub}</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "2px" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Chart */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Monthly earnings</h2>
            <span style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: "700" }}>Last 6 months</span>
          </div>
          <BarChart data={monthlyData} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f8fafc" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#8b5cf6" }}>$240</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>This month</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#10b981" }}>+33% ↑</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>vs last month</div>
            </div>
          </div>
        </div>

        {/* Revenue breakdown */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Revenue breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Gross revenue", value: `$${transactions.reduce((a, t) => a + t.amount, 0)}`, color: "#0f172a", sub: "total billed to mentees" },
              { label: "Platform fee (20%)", value: `-$${transactions.reduce((a, t) => a + t.platformCut, 0)}`, color: "#ef4444", sub: "MentorPath commission" },
              { label: "Your earnings", value: `$${totalEarned}`, color: "#10b981", sub: "what you keep (80%)" },
              { label: "Pending payout", value: `$${pendingPayout}`, color: "#f59e0b", sub: "processing now" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid #f8fafc" : "none" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#374151" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.sub}</div>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "800", color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Payout info */}
          <div style={{ background: "#f5f3ff", borderRadius: "10px", padding: "12px 14px", marginTop: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#8b5cf6", marginBottom: "2px" }}>💳 Payout schedule</p>
            <p style={{ fontSize: "12px", color: "#7c3aed" }}>Payouts are processed every Monday. Connect your bank account in settings to receive payments.</p>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Transaction history</h2>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>{transactions.length} transactions</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", marginBottom: "8px" }}>
            {["Mentee", "Topic", "Date", "Amount", "Status"].map(h => (
              <span key={h} style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {transactions.map((tx, i) => (
            <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "13px 14px", borderBottom: i < transactions.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${tx.color}cc, ${tx.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "11px", flexShrink: 0 }}>{tx.avatar}</div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{tx.mentee}</span>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{tx.topic.slice(0, 20)}...</span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{tx.date}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#10b981" }}>${tx.payout}</div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>of ${tx.amount}</div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: tx.status === "paid" ? "#10b981" : "#f59e0b", background: tx.status === "paid" ? "#f0fdf4" : "#fffbeb", padding: "3px 10px", borderRadius: "100px" }}>
                {tx.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Earnings() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <MentorSidebar />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <EarningsContent />
      </div>
    </div>
  );
}
