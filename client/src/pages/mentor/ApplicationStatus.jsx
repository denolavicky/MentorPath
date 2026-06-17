import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";

export default function ApplicationStatus() {
  const user = useSelector(selectUser);
  const status = user?.mentorStatus || "pending";

  const statusConfig = {
    pending: {
      icon: "⏳",
      title: "Application under review",
      message: "Your application has been received and is being reviewed by our team. This usually takes 2-3 business days.",
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    approved: {
      icon: "🎉",
      title: "Application approved!",
      message: "Congratulations! Your mentor application has been approved. You can now set up your profile and start accepting sessions.",
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    rejected: {
      icon: "😔",
      title: "Application not approved",
      message: "Unfortunately your application wasn't approved at this time. You're welcome to apply again in 30 days.",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
    },
  };

  const config = statusConfig[status];

  const steps = [
    { label: "Application submitted", done: true },
    { label: "Under review", done: status === "approved" || status === "rejected", active: status === "pending" },
    { label: "Decision made", done: status === "approved" || status === "rejected" },
    { label: "Profile activated", done: status === "approved" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
        <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: "16px", fontWeight: "800" }}>M</span>
        </div>
        <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>MentorPath</span>
      </Link>

      <div style={{ width: "100%", maxWidth: "540px" }}>

        {/* Status card */}
        <div style={{ background: "white", borderRadius: "20px", padding: "36px", border: "1px solid #f1f5f9", marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>{config.icon}</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>{config.title}</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>{config.message}</p>

          <div style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", color: config.color, fontWeight: "700" }}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </div>

          {/* Progress steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step.done ? "#10b981" : step.active ? "#f59e0b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step.done ? <span style={{ color: "white", fontSize: "11px" }}>✓</span> : step.active ? <span style={{ color: "white", fontSize: "10px" }}>●</span> : <span style={{ color: "#94a3b8", fontSize: "10px" }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: "13px", fontWeight: step.active ? "700" : "500", color: step.done ? "#10b981" : step.active ? "#f59e0b" : "#94a3b8" }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {status === "approved" && (
            <Link to="/mentor/dashboard" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", fontSize: "15px" }}>
              Go to mentor dashboard →
            </Link>
          )}
          {status === "pending" && (
            <div style={{ background: "white", borderRadius: "14px", padding: "20px", border: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>While you wait...</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Explore the platform as a mentee", "Check out mentor profiles for inspiration", "Prepare your availability schedule"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "#6366f1", fontSize: "12px" }}>→</span>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link to="/dashboard" style={{ display: "block", textAlign: "center", background: "white", color: "#374151", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "600", fontSize: "14px", border: "1px solid #e5e7eb" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
