import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { adminAPI } from "../../api/index.js";

const navItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin" },
  { icon: "👥", label: "Applications", path: "/admin/applications" },
  { icon: "👤", label: "Users", path: "/admin/users" },
  { icon: "📅", label: "Sessions", path: "/admin/sessions" },
  { icon: "💰", label: "Revenue", path: "/admin/revenue" },
  { icon: "🛡️", label: "Moderation", path: "/admin/moderation" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div style={{ width: "220px", minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "white" }}>Admin Panel</span>
        </Link>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", textDecoration: "none", color: "#94a3b8", fontSize: "13px", fontWeight: "500", background: window.location.pathname === item.path ? "rgba(245,158,11,0.15)" : "transparent" }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => { dispatch(logout()); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", width: "100%", background: "none", border: "none", cursor: "pointer" }}>
          <span>🚪</span><span style={{ fontSize: "13px", fontWeight: "500", color: "#ef4444" }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await adminAPI.getApplications();
        setApplications(data.applications);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filtered = applications.filter(a => filter === "all" ? true : a.mentorStatus === filter);

  const handleDecision = async (id, status) => {
    setActionLoading(true);
    try {
      await adminAPI.reviewApplication(id, { status });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, mentorStatus: status } : a));
      setSelected(prev => prev ? { ...prev, mentorStatus: status } : null);
    } catch (err) {
      console.error("Decision error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status) => {
    const config = {
      pending: { color: "#f59e0b", bg: "#fffbeb", label: "Pending" },
      approved: { color: "#10b981", bg: "#f0fdf4", label: "Approved" },
      rejected: { color: "#ef4444", bg: "#fef2f2", label: "Rejected" },
    };
    const c = config[status] || config.pending;
    return <span style={{ fontSize: "11px", fontWeight: "700", color: c.color, background: c.bg, padding: "3px 10px", borderRadius: "100px" }}>{c.label}</span>;
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "32px", minWidth: 0 }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>Mentor Applications</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Review and approve mentor applications.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total", value: applications.length, color: "#6366f1" },
            { label: "Pending", value: applications.filter(a => a.mentorStatus === "pending").length, color: "#f59e0b" },
            { label: "Approved", value: applications.filter(a => a.mentorStatus === "approved").length, color: "#10b981" },
            { label: "Rejected", value: applications.filter(a => a.mentorStatus === "rejected").length, color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "18px", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: filter === f ? "#6366f1" : "white", color: filter === f ? "white" : "#64748b", border: filter === f ? "none" : "1px solid #e5e7eb", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Loading applications...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "20px" }}>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "14px", border: "1px solid #f1f5f9" }}>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>No {filter} applications</p>
                </div>
              ) : filtered.map(app => (
                <div key={app._id} onClick={() => setSelected(app)} style={{ background: "white", borderRadius: "14px", padding: "18px", border: selected?._id === app._id ? "2px solid #6366f1" : "1px solid #f1f5f9", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a", marginBottom: "2px" }}>{app.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{app.email}</div>
                    </div>
                    {statusBadge(app.mentorStatus)}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#6366f1", background: "#eef2ff", padding: "3px 8px", borderRadius: "6px" }}>{app.careerField}</span>
                    {app.experience && <span style={{ fontSize: "12px", color: "#94a3b8" }}>{app.experience}</span>}
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5", marginBottom: "6px" }}>{app.bio?.slice(0, 100)}...</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8" }}>Applied {formatDate(app.createdAt)}</p>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", height: "fit-content", position: "sticky", top: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>Application detail</h2>
                  <button onClick={() => setSelected(null)} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", color: "#64748b", fontSize: "12px" }}>✕ Close</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  {[
                    ["Name", selected.name],
                    ["Email", selected.email],
                    ["Field", selected.careerField],
                    ["Experience", selected.experience],
                    ["Skills", selected.skills?.join(", ") || "—"],
                    ["Session price", selected.sessionPrice ? `$${selected.sessionPrice}/session` : "—"],
                    ["Status", selected.mentorStatus],
                    ["Applied", formatDate(selected.createdAt)],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", minWidth: "90px" }}>{label}</span>
                      <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600", textTransform: label === "Status" ? "capitalize" : "none" }}>{value}</span>
                    </div>
                  ))}
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "4px" }}>Bio</span>
                    <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{selected.bio}</p>
                  </div>
                </div>

                {selected.mentorStatus === "pending" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleDecision(selected._id, "approved")} disabled={actionLoading} style={{ flex: 1, background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                      {actionLoading ? "..." : "✓ Approve"}
                    </button>
                    <button onClick={() => handleDecision(selected._id, "rejected")} disabled={actionLoading} style={{ flex: 1, background: "white", color: "#ef4444", border: "2px solid #fecaca", padding: "12px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                      {actionLoading ? "..." : "✕ Reject"}
                    </button>
                  </div>
                )}
                {selected.mentorStatus === "approved" && (
                  <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <span style={{ fontSize: "13px", color: "#10b981", fontWeight: "700" }}>✓ Approved</span>
                  </div>
                )}
                {selected.mentorStatus === "rejected" && (
                  <div style={{ background: "#fef2f2", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: "700" }}>✕ Rejected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
