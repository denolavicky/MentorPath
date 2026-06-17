import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice.js";
import { authAPI } from "../../api/index.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState("mentee");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
      const { data } = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (role === "mentee") navigate("/onboarding");
      else navigate("/mentor/apply");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px",
    border: hasError ? "2px solid #ef4444" : "2px solid #e5e7eb",
    background: "white", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

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
              Your career journey starts with the right guide
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.7", marginBottom: "40px" }}>
              Join thousands of students and graduates who found clarity, direction, and their first opportunity through MentorPath.
            </p>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "28px", color: "#6366f1", fontFamily: "Georgia, serif", marginBottom: "10px", lineHeight: 1 }}>"</div>
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                I booked my first session not knowing what to expect. Three months later I had a job offer at a fintech startup. MentorPath changed everything for me.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>KA</div>
                <div>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>Kofi Asante</div>
                  <div style={{ color: "#64748b", fontSize: "12px" }}>Software Developer, Lagos</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "32px", marginTop: "32px" }}>
              {[["500+", "Mentors"], ["2k+", "Sessions"], ["4.9★", "Rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "white" }}>{num}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: "#334155", fontSize: "12px", position: "relative", zIndex: 1 }}>© 2024 MentorPath</p>
        </div>
      )}

      {/* ── RIGHT PANEL / Full screen on mobile ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "32px 20px 48px" : "48px 5%", background: "#fafafa", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>M</span>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>MentorPath</span>
              </Link>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Create your account</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#6366f1", fontWeight: "700", textDecoration: "none" }}>Log in</Link>
            </p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>I want to join as a</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { value: "mentee", label: "Mentee", desc: "I want to find a mentor", icon: "🎯" },
                { value: "mentor", label: "Mentor", desc: "I want to guide others", icon: "🌟" },
              ].map((option) => (
                <button key={option.value} onClick={() => setRole(option.value)} style={{
                  background: role === option.value ? "linear-gradient(135deg, #eef2ff, #f0f0ff)" : "white",
                  border: role === option.value ? "2px solid #6366f1" : "2px solid #e5e7eb",
                  borderRadius: "14px", padding: isMobile ? "14px 12px" : "16px",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "6px" }}>{option.icon}</div>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: role === option.value ? "#6366f1" : "#0f172a", marginBottom: "2px" }}>{option.label}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", color: "#dc2626", fontSize: "14px" }}>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Full name</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Amara Okafor"
                style={inputStyle(errors.name)}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = errors.name ? "#ef4444" : "#e5e7eb"}
              />
              {errors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Email address</label>
              <input
                name="email" value={form.email} onChange={handleChange}
                type="email" placeholder="you@example.com"
                style={inputStyle(errors.email)}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "#e5e7eb"}
              />
              {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Password</label>
              <input
                name="password" value={form.password} onChange={handleChange}
                type="password" placeholder="At least 6 characters"
                style={inputStyle(errors.password)}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = errors.password ? "#ef4444" : "#e5e7eb"}
              />
              {errors.password && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Confirm password</label>
              <input
                name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                type="password" placeholder="Re-enter your password"
                style={inputStyle(errors.confirmPassword)}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = errors.confirmPassword ? "#ef4444" : "#e5e7eb"}
              />
              {errors.confirmPassword && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: "12px",
              padding: "14px", fontSize: "15px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.4)",
              marginTop: "4px",
            }}>
              {loading ? "Creating account..." : `Create ${role === "mentee" ? "mentee" : "mentor"} account →`}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Google button */}
          <a href="http://localhost:5000/api/auth/google" style={{
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

          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "20px", textAlign: "center", lineHeight: "1.6" }}>
            By creating an account you agree to our{" "}
            <Link to="/terms" style={{ color: "#6366f1", textDecoration: "none" }}>Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" style={{ color: "#6366f1", textDecoration: "none" }}>Privacy Policy</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
