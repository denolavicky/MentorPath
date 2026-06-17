import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { reviewsAPI, sessionsAPI } from "../../api/index.js";

const ratingLabels = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

function nameColor(name = "") {
  const colors = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ef4444","#0ea5e9","#f97316","#14b8a6"];
  return colors[name.charCodeAt(0) % colors.length];
}

function initials(name = "") {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none", border: "none", cursor: "pointer", fontSize: "36px", padding: "0",
            transition: "transform 0.1s",
            transform: (hovered >= star || value >= star) ? "scale(1.2)" : "scale(1)",
            color: (hovered >= star || value >= star) ? "#f59e0b" : "#e5e7eb",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function LeaveReviewContent() {
  const { id } = useParams(); // session ID
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const positiveTags = ["Very knowledgeable", "Patient and clear", "Great communicator", "Actionable advice", "Well prepared", "Encouraging", "Honest feedback", "Went above and beyond"];
  const negativeTags = ["Could improve communication", "Session felt rushed", "Needed more preparation", "Advice wasn't specific enough"];

  // Fetch real session from API
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await sessionsAPI.getById(id);
        setSession(res.data.session);
      } catch (err) {
        console.error("Failed to load session:", err);
        setError("Could not load session details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!rating || !session) return;
    setSubmitting(true);
    try {
      await reviewsAPI.leave({
        mentorId: session.mentor._id,
        sessionId: id,
        rating,
        text: review,
        tags,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Review error:", err);
      alert(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
        Loading session...
      </div>
    );
  }

  // Error
  if (error || !session) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <p style={{ color: "#ef4444", fontWeight: "600" }}>{error || "Session not found."}</p>
        <Link to="/my-sessions" style={{ marginTop: "16px", display: "inline-block", color: "#6366f1", fontWeight: "700" }}>← Back to sessions</Link>
      </div>
    );
  }

  const mentor = session.mentor || {};
  const color = nameColor(mentor.name);

  // Success screen
  if (submitted) {
    return (
      <div style={{ padding: "32px", maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "48px 32px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌟</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Thank you for your review!</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" }}>
            Your feedback helps <strong>{mentor.name}</strong> improve and helps other mentees make better decisions.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "28px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} style={{ fontSize: "24px", color: s <= rating ? "#f59e0b" : "#e5e7eb" }}>★</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/my-sessions" style={{ flex: 1, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textAlign: "center" }}>
              My sessions
            </Link>
            <Link to="/explore" style={{ flex: 1, background: "white", color: "#374151", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "1px solid #e5e7eb", textAlign: "center" }}>
              Find another mentor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "640px" }}>

      {/* Back */}
      <Link to="/my-sessions" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
        ← Back to sessions
      </Link>

      <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Leave a review</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>Share your experience to help other mentees.</p>

      {/* Mentor card */}
      <div style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", marginBottom: "24px", display: "flex", gap: "14px", alignItems: "center" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "16px", flexShrink: 0, overflow: "hidden" }}>
          {mentor.avatar
            ? <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials(mentor.name)}
        </div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a" }}>{mentor.name}</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>{mentor.careerField || "Mentor"}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
            Session: {new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at {session.time}
          </div>
        </div>
      </div>

      {/* Star rating */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "16px" }}>
        <p style={{ fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>How would you rate this session?</p>
        <StarPicker value={rating} onChange={setRating} />
        {rating > 0 && (
          <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "700", color }}>
            {ratingLabels[rating]}
          </div>
        )}
      </div>

      {/* Tags */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "16px" }}>
        <p style={{ fontWeight: "700", color: "#0f172a", marginBottom: "14px" }}>What stood out? (optional)</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          {positiveTags.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: tags.includes(tag) ? "#f0fdf4" : "#f8fafc", color: tags.includes(tag) ? "#10b981" : "#64748b", border: `1px solid ${tags.includes(tag) ? "#bbf7d0" : "#e5e7eb"}`, transition: "all 0.15s" }}>
              {tag}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {negativeTags.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: tags.includes(tag) ? "#fef2f2" : "#f8fafc", color: tags.includes(tag) ? "#ef4444" : "#64748b", border: `1px solid ${tags.includes(tag) ? "#fecaca" : "#e5e7eb"}`, transition: "all 0.15s" }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Written review */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <p style={{ fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Write a review (optional)</p>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Describe your experience with this mentor..."
          rows={4}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", color: "#374151", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px", textAlign: "right" }}>{review.length}/500</div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!rating || submitting}
        style={{
          width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: rating ? "pointer" : "not-allowed",
          background: rating ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb",
          color: rating ? "white" : "#94a3b8", fontWeight: "800", fontSize: "15px", transition: "opacity 0.2s",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Submitting..." : "Submit review"}
      </button>

      {!rating && (
        <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>Please select a star rating to continue</p>
      )}
    </div>
  );
}

export default function LeaveReview() {
  return (
    <MenteeLayout>
      <LeaveReviewContent />
    </MenteeLayout>
  );
}
