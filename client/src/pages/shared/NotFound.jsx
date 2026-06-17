import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>🔍</div>
        <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>404</h1>
        <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "32px" }}>This page doesn't exist.</p>
        <Link to="/" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "13px 28px", borderRadius: "12px", fontWeight: "700", fontSize: "15px" }}>Go home →</Link>
      </div>
    </div>
  );
}