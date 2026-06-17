import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";
import { mentorsAPI } from "../../api/index.js";

const fields = ["All fields", "Software Engineering", "Product Management", "UI/UX Design", "Data Science", "Cybersecurity", "DevOps / Cloud", "Digital Marketing", "Finance & Fintech"];
const priceRanges = ["Any price", "Under $15", "$15 - $25", "$25 - $35", "Over $35"];
const sortOptions = ["Most popular", "Highest rated", "Lowest price", "Most reviews"];

function StarRating({ rating, reviews }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb", fontSize: "12px" }}>★</span>
      ))}
      <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "2px" }}>{rating} ({reviews})</span>
    </div>
  );
}

function MentorCard({ mentor }) {
  const [saved, setSaved] = useState(false);

  // Generate initials from name
  const initials = mentor.name
    ? mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  // Pick a color based on first letter
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#0ea5e9", "#f97316", "#14b8a6"];
  const color = colors[mentor.name?.charCodeAt(0) % colors.length] || "#6366f1";

  const rating = mentor.averageRating || 0;
  const reviews = mentor.totalReviews || 0;
  const sessions = mentor.totalSessions || 0;

  return (
    <div
      style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `linear-gradient(135deg, ${color}cc, ${color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "16px", flexShrink: 0, position: "relative" }}>
            {mentor.avatar ? (
              <img src={mentor.avatar} alt={mentor.name} style={{ width: "100%", height: "100%", borderRadius: "14px", objectFit: "cover" }} />
            ) : initials}
            {mentor.isAvailable && (
              <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", border: "2px solid white" }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a" }}>{mentor.name}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              {mentor.applicationData?.jobTitle || "Mentor"} {mentor.applicationData?.company ? `@ ${mentor.applicationData.company}` : ""}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
              🌍 {mentor.applicationData?.country || "Global"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          style={{ background: saved ? "#fef2f2" : "#f8fafc", border: `1px solid ${saved ? "#fecaca" : "#e5e7eb"}`, borderRadius: "8px", padding: "6px 8px", cursor: "pointer", fontSize: "14px" }}
        >
          {saved ? "❤" : "🤍"}
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", marginBottom: "14px" }}>
        {mentor.bio || "No bio provided yet."}
      </p>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
        {(mentor.skills || []).slice(0, 3).map(s => (
          <span key={s} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>{s}</span>
        ))}
        {(mentor.skills || []).length > 3 && (
          <span style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>+{mentor.skills.length - 3}</span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingTop: "14px", borderTop: "1px solid #f8fafc" }}>
        <StarRating rating={rating} reviews={reviews} />
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{sessions} sessions</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "20px", fontWeight: "800", color: color }}>${mentor.sessionPrice || 0}</span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>/session</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to={`/mentors/${mentor._id}`} style={{ padding: "9px 16px", borderRadius: "9px", border: `1px solid ${color}33`, color: color, fontWeight: "700", fontSize: "12px", textDecoration: "none", background: `${color}0d` }}>View profile</Link>
          <Link to={`/book/${mentor._id}`} style={{ padding: "9px 16px", borderRadius: "9px", background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white", fontWeight: "700", fontSize: "12px", textDecoration: "none" }}>Book →</Link>
        </div>
      </div>
    </div>
  );
}

function ExploreMentorsContent() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedField, setSelectedField] = useState("All fields");
  const [selectedPrice, setSelectedPrice] = useState("Any price");
  const [selectedSort, setSelectedSort] = useState("Most popular");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Fetch real mentors from MongoDB on page load
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await mentorsAPI.getAll();
        setMentors(res.data.mentors || []);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
        setError("Failed to load mentors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filtered = mentors
    .filter(m => {
      const matchSearch =
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.careerField?.toLowerCase().includes(search.toLowerCase()) ||
        (m.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        m.applicationData?.company?.toLowerCase().includes(search.toLowerCase());
      const matchField = selectedField === "All fields" || m.careerField === selectedField;
      const matchAvailable = !availableOnly || m.isAvailable;
      const matchPrice =
        selectedPrice === "Any price" ? true :
        selectedPrice === "Under $15" ? m.sessionPrice < 15 :
        selectedPrice === "$15 - $25" ? m.sessionPrice >= 15 && m.sessionPrice <= 25 :
        selectedPrice === "$25 - $35" ? m.sessionPrice > 25 && m.sessionPrice <= 35 :
        m.sessionPrice > 35;
      return matchSearch && matchField && matchAvailable && matchPrice;
    })
    .sort((a, b) =>
      selectedSort === "Highest rated" ? (b.averageRating || 0) - (a.averageRating || 0) :
      selectedSort === "Lowest price" ? (a.sessionPrice || 0) - (b.sessionPrice || 0) :
      selectedSort === "Most reviews" ? (b.totalReviews || 0) - (a.totalReviews || 0) :
      (b.totalSessions || 0) - (a.totalSessions || 0)
    );

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Find your mentor</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          {loading ? "Loading mentors..." : `Browse ${mentors.length} verified professional${mentors.length !== 1 ? "s" : ""} ready to guide you.`}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, skill, field or company..."
          style={{ width: "100%", padding: "14px 16px 14px 46px", borderRadius: "12px", fontSize: "14px", border: "2px solid #e5e7eb", background: "white", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <select value={selectedField} onChange={e => setSelectedField(e.target.value)} style={{ padding: "9px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white", outline: "none", cursor: "pointer" }}>
          {fields.map(f => <option key={f}>{f}</option>)}
        </select>
        <select value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)} style={{ padding: "9px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white", outline: "none", cursor: "pointer" }}>
          {priceRanges.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)} style={{ padding: "9px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white", outline: "none", cursor: "pointer" }}>
          {sortOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setAvailableOnly(!availableOnly)}
          style={{ padding: "9px 14px", borderRadius: "10px", border: `2px solid ${availableOnly ? "#10b981" : "#e5e7eb"}`, fontSize: "13px", fontWeight: "600", color: availableOnly ? "#10b981" : "#374151", background: availableOnly ? "#f0fdf4" : "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
          Available now
        </button>
        <span style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>
          {!loading && `${filtered.length} mentor${filtered.length !== 1 ? "s" : ""} found`}
        </span>
      </div>

      {/* Field pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
        {fields.map(f => (
          <button key={f} onClick={() => setSelectedField(f)} style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", background: selectedField === f ? "#6366f1" : "white", color: selectedField === f ? "white" : "#64748b", border: selectedField === f ? "none" : "1px solid #e5e7eb", cursor: "pointer", transition: "all 0.15s" }}>{f}</button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px", animation: "spin 1s linear infinite" }}>⏳</div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading mentors...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1px solid #fee2e2" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Something went wrong</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Try again</button>
        </div>
      )}

      {/* Empty state — no mentors in DB yet */}
      {!loading && !error && mentors.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧑‍🏫</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No mentors yet</h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Mentors are being reviewed and approved. Check back soon!</p>
        </div>
      )}

      {/* Empty state — filters returned nothing */}
      {!loading && !error && mentors.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No mentors found</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Try adjusting your filters or search term.</p>
          <button onClick={() => { setSearch(""); setSelectedField("All fields"); setSelectedPrice("Any price"); setAvailableOnly(false); }} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Clear filters</button>
        </div>
      )}

      {/* Mentor grid */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {filtered.map(mentor => <MentorCard key={mentor._id} mentor={mentor} />)}
        </div>
      )}
    </div>
  );
}

export default function MenteeExploreMentors() {
  return (
    <MenteeLayout>
      <ExploreMentorsContent />
    </MenteeLayout>
  );
}
