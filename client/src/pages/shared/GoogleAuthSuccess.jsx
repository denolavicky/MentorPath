import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice.js";

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        dispatch(setCredentials({ user, token }));

        // Redirect based on role and onboarding status
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "mentor") {
          navigate("/mentor/dashboard");
        } else if (!user.onboardingComplete) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google auth error:", err);
        navigate("/login?error=google_failed");
      }
    } else {
      navigate("/login?error=google_failed");
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fafafa" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid #f1f5f9", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Signing you in with Google...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
