import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { mentorsAPI, reviewsAPI } from "../../api/index.js";

function nameColor(name = "") {
  const colors = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ef4444","#0ea5e9","#f97316","#14b8a6"];
  return colors[name.charCodeAt(0) % colors.length];
}

function initials(name = "") {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb", fontSize: `${size}px` }}>★</span>
      ))}
    </div>
  );
}

function MentorProfileContent() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [mentorRes, reviewsRes] = await Promise.all([
          mentorsAPI.getById(id),
          reviewsAPI.getMentorReviews(id),
        ]);
        setMentor(mentorRes.data.mentor);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error("Failed to load mentor:", err);
        setError("Could not load mentor profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
        Loading mentor profile...
      </div>
    );
  }

  // Error
  if (error || !mentor) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Mentor not found</h2>
        <Link to="/explore" style={{ color: "#6366f1", fontWeight: "700", textDecoration: "none" }}>← Back to explore</Link>
      </div>
    );
  }

  const color = nameColor(mentor.name);
  const rating = mentor.rating || 0;
  const reviewCount = mentor.totalReviews || reviews.length || 0;
  const appData = mentor.applicationData || {};

  // Calculate star distribution from real reviews
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <div style={{ padding: "32px" }}>

      {/* Back */}
      <Link to="/explore" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
        ← Back to explore
      </Link>

      {/* Header */}
      <div style={{ background: "white", borderRadius: "20px", padding: "28px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Avatar + info */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flex: 1 }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "24px", flexShrink: 0, overflow: "hidden", position: "relative" }}>
              {mentor.avatar
                ? <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials(mentor.name)}
              {mentor.isAvailable && (
                <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "14px", height: "14px", background: "#10b981", borderRadius: "50%", border: "2px solid white" }} />
              )}
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{mentor.name}</h1>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "6px" }}>
                {appData.jobTitle || "Mentor"}{appData.company ? ` @ ${appData.company}` : ""}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
                🌍 {appData.country || "Global"}
              </p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <StarRating rating={rating} />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{rating}</span>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>({reviewCount} reviews)</span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>📅 {mentor.totalSessions || 0} sessions</div>
                {appData.yearsExperience && (
                  <div style={{ fontSize: "13px", color: "#64748b" }}>⏱ {appData.yearsExperience} yrs experience</div>
                )}
              </div>
              {(appData.languages || []).length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {appData.languages.map(l => (
                    <span key={l} style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "3px 8px", borderRadius: "6px" }}>💬 {l}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking card */}
          <div style={{ background: "#fafafa", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", minWidth: "200px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "800", color, marginBottom: "4px" }}>${mentor.sessionPrice || 0}</div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>per session</div>
            <Link
              to={`/book/${mentor._id}`}
              style={{ display: "block", background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", marginBottom: "10px", boxShadow: `0 4px 14px ${color}40` }}
            >
              Book a session →
            </Link>
            <button style={{ display: "block", width: "100%", background: "white", border: "1px solid #e5e7eb", color: "#374151", padding: "10px", borderRadius: "12px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
              🤍 Save mentor
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", border: "1px solid #f1f5f9", marginBottom: "20px", width: "fit-content" }}>
        {["about", "reviews", "availability"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", background: activeTab === tab ? `linear-gradient(135deg, ${color}, ${color}cc)` : "transparent", color: activeTab === tab ? "white" : "#64748b", fontWeight: "700", fontSize: "13px", transition: "all 0.2s", textTransform: "capitalize" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* About tab */}
      {activeTab === "about" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>About me</h2>
            {mentor.bio
              ? mentor.bio.split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", marginBottom: "12px" }}>{para}</p>
                ))
              : <p style={{ fontSize: "14px", color: "#94a3b8" }}>No bio provided yet.</p>
            }
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Skills */}
            <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Skills & expertise</h2>
              {(mentor.skills || []).length > 0
                ? <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {mentor.skills.map(s => (
                      <span key={s} style={{ background: `${color}12`, color, fontSize: "12px", fontWeight: "700", padding: "5px 12px", borderRadius: "8px", border: `1px solid ${color}22` }}>{s}</span>
                    ))}
                  </div>
                : <p style={{ fontSize: "13px", color: "#94a3b8" }}>No skills listed yet.</p>
              }
            </div>

            {/* What mentee can help with */}
            {(mentor.expertise || []).length > 0 && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>What I can help with</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {mentor.expertise.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: `linear-gradient(135deg, ${color}, ${color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <span style={{ color: "white", fontSize: "10px", fontWeight: "800" }}>✓</span>
                      </div>
                      <span style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews tab */}
      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Rating summary */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: "800", color: "#0f172a", lineHeight: 1 }}>{rating || "—"}</div>
              <StarRating rating={rating} size={18} />
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{reviewCount} reviews</div>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              {starCounts.map(({ star, pct }) => (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", minWidth: "12px" }}>{star}</span>
                  <span style={{ color: "#f59e0b", fontSize: "12px" }}>★</span>
                  <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#f59e0b", borderRadius: "100px" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8", minWidth: "30px" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          {reviews.length > 0
            ? reviews.map((review, i) => {
                const mentee = review.mentee || {};
                const reviewColor = nameColor(mentee.name || "A");
                return (
                  <div key={i} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${reviewColor}cc, ${reviewColor}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px", overflow: "hidden" }}>
                          {mentee.avatar
                            ? <img src={mentee.avatar} alt={mentee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : initials(mentee.name || "A")}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{mentee.name || "Anonymous"}</div>
                          <StarRating rating={review.rating} size={12} />
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {review.tags && review.tags.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                        {review.tags.map(tag => (
                          <span key={tag} style={{ fontSize: "11px", fontWeight: "600", color: "#10b981", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "6px" }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    {review.text && (
                      <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{review.text}</p>
                    )}
                  </div>
                );
              })
            : (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
                <p style={{ color: "#64748b", fontWeight: "600" }}>No reviews yet. Be the first!</p>
              </div>
            )
          }
        </div>
      )}

      {/* Availability tab */}
      {activeTab === "availability" && (
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Available time slots</h2>
          {(appData.availability || []).length > 0
            ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {appData.availability.map((slot, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px" }}>📅</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{slot}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#10b981", background: "#f0fdf4", padding: "4px 10px", borderRadius: "6px" }}>Available</span>
                  </div>
                ))}
              </div>
            )
            : (
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>No availability set yet. You can still book and the mentor will confirm.</p>
            )
          }
          <Link
            to={`/book/${mentor._id}`}
            style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", textDecoration: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", boxShadow: `0 4px 14px ${color}40` }}
          >
            Book a session →
          </Link>
        </div>
      )}

    </div>
  );
}

export default function MentorProfile() {
  return (
    <MenteeLayout>
      <MentorProfileContent />
    </MenteeLayout>
  );
}
