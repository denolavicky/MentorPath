import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../api/index.js";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await authAPI.forgotPassword(email); setSent(true); } catch { setSent(true); } finally { setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa", padding: "40px 5%" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "20px", padding: "40px", border: "1px solid #f1f5f9" }}>
        <Link to="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}>← Back to login</Link>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "16px 0 8px" }}>Forgot your password?</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Enter your email and we'll send you a reset link.</p>
        {sent ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📧</div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#166534" }}>Check your email!</p>
            <p style={{ fontSize: "13px", color: "#166534", marginTop: "4px" }}>If an account exists, we've sent a reset link to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
              onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            <button type="submit" disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "13px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}