import { Link } from "react-router-dom";
export default function VerifyEmail() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa" }}>
      <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", maxWidth: "440px" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>📧</div>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Verify your email</h1>
        <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>We've sent a verification link to your email. Click the link to activate your account.</p>
        <Link to="/login" style={{ display: "inline-block", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "12px", fontWeight: "700", fontSize: "14px" }}>Go to login</Link>
      </div>
    </div>
  );
}