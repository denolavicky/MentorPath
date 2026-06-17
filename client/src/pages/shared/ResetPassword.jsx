import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); if (password === confirm && password.length >= 6) { setDone(true); setTimeout(() => navigate("/login"), 2000); } };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa", padding: "40px 5%" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "20px", padding: "40px", border: "1px solid #f1f5f9" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Reset your password</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Enter your new password below.</p>
        {done ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#166534" }}>✓ Password reset! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[["New password", password, setPassword], ["Confirm password", confirm, setConfirm]].map(([label, val, setter]) => (
              <div key={label}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>{label}</label>
                <input type="password" value={val} onChange={e => setter(e.target.value)} placeholder="At least 6 characters" required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>
            ))}
            <button type="submit" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "13px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "4px" }}>
              Reset password
            </button>
          </form>
        )}
        <Link to="/login" style={{ display: "block", textAlign: "center", marginTop: "16px", color: "#6366f1", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}>Back to login</Link>
      </div>
    </div>
  );
}