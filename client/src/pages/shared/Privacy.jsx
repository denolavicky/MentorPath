import { Link } from "react-router-dom";
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa", padding: "60px 5%" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>← Back to home</Link>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "24px 0 8px" }}>Privacy Policy</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>Last updated: January 2024</p>
        {["Information We Collect", "How We Use Your Data", "Data Sharing", "Cookies", "Your Rights", "Security", "Contact Us"].map(section => (
          <div key={section} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>{section}</h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>This section covers {section.toLowerCase()}. We take your privacy seriously and are committed to protecting your personal information.</p>
          </div>
        ))}
      </div>
    </div>
  );
}