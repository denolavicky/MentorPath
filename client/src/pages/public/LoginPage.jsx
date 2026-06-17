import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice.js";
import { authAPI } from "../../api/index.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email: form.email, password: form.password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "mentor") navigate("/mentor/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── LEFT PANEL — hidden on mobile ── */}
      {!isMobile && (
        <div style={{
          width: "45%", background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          padding: "48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "0", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "white" }}>MentorPath</span>
          </Link>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "white", lineHeight: "1.2", marginBottom: "16px" }}>
              Welcome back — your mentor is waiting
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.7", marginBottom: "40px" }}>
              Pick up right where you left off. Book a session, check your messages, or explore a new roadmap.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "📅", title: "Book sessions", desc: "Schedule 1-on-1 time with your mentor" },
                { icon: "💬", title: "Real-time messaging", desc: "Chat directly with your mentor anytime" },
                { icon: "🗺️", title: "Career roadmaps", desc: "Follow step-by-step guides to your goal" },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(99,102,241,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "14px", marginBottom: "2px" }}>{item.title}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: "#334155", fontSize: "12px", position: "relative", zIndex: 1 }}>© 2024 MentorPath</p>
        </div>
      )}

      {/* ── RIGHT PANEL / Full screen on mobile ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 20px" : "48px 5%", background: "#fafafa" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>M</span>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>MentorPath</span>
              </Link>
            </div>
          )}

          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Log in to your account</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#6366f1", fontWeight: "700", textDecoration: "none" }}>Sign up free</Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Email address</label>
              <input
                name="email" value={form.email} onChange={handleChange}
                type="email" placeholder="you@example.com"
                style={{
                  width: "100%", padding: "13px 14px", borderRadius: "10px", fontSize: "14px",
                  border: errors.email ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  background: "white", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "#e5e7eb"}
              />
              {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "12px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  name="password" value={form.password} onChange={handleChange}
                  type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  style={{
                    width: "100%", padding: "13px 44px 13px 14px", borderRadius: "10px", fontSize: "14px",
                    border: errors.password ? "2px solid #ef4444" : "2px solid #e5e7eb",
                    background: "white", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = errors.password ? "#ef4444" : "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "16px", padding: "0" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: "12px",
              padding: "14px", fontSize: "15px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.4)",
            }}>
              {loading ? "Logging in..." : "Log in →"}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Google button */}
          <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            padding: "13px", borderRadius: "12px", border: "2px solid #e5e7eb",
            background: "white", textDecoration: "none", color: "#374151",
            fontWeight: "700", fontSize: "14px",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
            </svg>
            Continue with Google
          </a>

          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "20px", textAlign: "center" }}>
            <Link to="/terms" style={{ color: "#6366f1", textDecoration: "none" }}>Terms</Link>{" · "}
            <Link to="/privacy" style={{ color: "#6366f1", textDecoration: "none" }}>Privacy</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
