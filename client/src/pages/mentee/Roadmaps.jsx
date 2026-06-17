import { useState } from "react";
import { Link } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";

const roadmaps = [
  {
    id: "1", title: "Frontend Developer Roadmap", mentor: { name: "Amara Okafor", avatar: "AO", color: "#6366f1", role: "Software Engineer @ Google" },
    field: "Software Engineering", level: "Beginner", duration: "6 months", steps: 12, saves: 234, color: "#6366f1",
    description: "A complete step-by-step guide to becoming a frontend developer from scratch. Covers HTML, CSS, JavaScript, React, and how to land your first job.",
    tags: ["HTML", "CSS", "JavaScript", "React", "Git"],
    outline: [
      { step: 1, title: "Learn HTML fundamentals", duration: "1 week", done: false },
      { step: 2, title: "Master CSS and layouts", duration: "2 weeks", done: false },
      { step: 3, title: "JavaScript basics", duration: "3 weeks", done: false },
      { step: 4, title: "DOM manipulation", duration: "1 week", done: false },
      { step: 5, title: "Git & GitHub", duration: "3 days", done: false },
      { step: 6, title: "React fundamentals", duration: "3 weeks", done: false },
      { step: 7, title: "React hooks & state management", duration: "2 weeks", done: false },
      { step: 8, title: "Build 2 real projects", duration: "4 weeks", done: false },
      { step: 9, title: "Learn TypeScript basics", duration: "1 week", done: false },
      { step: 10, title: "API integration & async JS", duration: "1 week", done: false },
      { step: 11, title: "Polish your portfolio", duration: "2 weeks", done: false },
      { step: 12, title: "Start applying for jobs", duration: "ongoing", done: false },
    ],
  },
  {
    id: "2", title: "Breaking into Product Management", mentor: { name: "Tunde Adeyemi", avatar: "TA", color: "#10b981", role: "Product Manager @ Flutterwave" },
    field: "Product Management", level: "Intermediate", duration: "4 months", steps: 8, saves: 189, color: "#10b981",
    description: "The exact path to transition into product management with no prior PM experience. Learn frameworks, build your portfolio, and ace PM interviews.",
    tags: ["Product Strategy", "Agile", "Case Studies", "Metrics", "UX"],
    outline: [
      { step: 1, title: "Understand what PMs actually do", duration: "3 days", done: false },
      { step: 2, title: "Learn product frameworks (RICE, MoSCoW)", duration: "1 week", done: false },
      { step: 3, title: "Study product metrics and analytics", duration: "1 week", done: false },
      { step: 4, title: "Write your first 2 case studies", duration: "3 weeks", done: false },
      { step: 5, title: "Build a product portfolio", duration: "2 weeks", done: false },
      { step: 6, title: "Mock PM interviews (prep + practice)", duration: "2 weeks", done: false },
      { step: 7, title: "Apply to APM & junior PM roles", duration: "ongoing", done: false },
      { step: 8, title: "Network with PMs on LinkedIn", duration: "ongoing", done: false },
    ],
  },
  {
    id: "3", title: "UI/UX Design from Scratch", mentor: { name: "Chioma Eze", avatar: "CE", color: "#f59e0b", role: "UX Design Lead @ Microsoft" },
    field: "UI/UX Design", level: "Beginner", duration: "5 months", steps: 10, saves: 156, color: "#f59e0b",
    description: "Go from zero design experience to building a portfolio that gets you hired. Learn Figma, UX principles, user research, and how to present your work.",
    tags: ["Figma", "User Research", "Prototyping", "Portfolio", "Case Studies"],
    outline: [
      { step: 1, title: "Learn Figma fundamentals", duration: "1 week", done: false },
      { step: 2, title: "Understand UX principles", duration: "1 week", done: false },
      { step: 3, title: "User research methods", duration: "1 week", done: false },
      { step: 4, title: "Information architecture", duration: "3 days", done: false },
      { step: 5, title: "Wireframing & prototyping", duration: "2 weeks", done: false },
      { step: 6, title: "Visual design basics", duration: "1 week", done: false },
      { step: 7, title: "Design systems & components", duration: "1 week", done: false },
      { step: 8, title: "Build 3 portfolio case studies", duration: "6 weeks", done: false },
      { step: 9, title: "Get feedback and iterate", duration: "2 weeks", done: false },
      { step: 10, title: "Apply for junior UX roles", duration: "ongoing", done: false },
    ],
  },
  {
    id: "4", title: "Data Science for Beginners", mentor: { name: "Kwame Mensah", avatar: "KM", color: "#8b5cf6", role: "Data Scientist @ MTN" },
    field: "Data Science", level: "Beginner", duration: "8 months", steps: 10, saves: 98, color: "#8b5cf6",
    description: "Start from scratch and learn everything you need to land a data science role. Covers Python, statistics, machine learning, and real projects.",
    tags: ["Python", "SQL", "Machine Learning", "Statistics", "Power BI"],
    outline: [
      { step: 1, title: "Learn Python basics", duration: "3 weeks", done: false },
      { step: 2, title: "Statistics & probability fundamentals", duration: "2 weeks", done: false },
      { step: 3, title: "Data manipulation with Pandas", duration: "2 weeks", done: false },
      { step: 4, title: "Data visualization", duration: "1 week", done: false },
      { step: 5, title: "SQL for data analysis", duration: "2 weeks", done: false },
      { step: 6, title: "Machine learning basics", duration: "4 weeks", done: false },
      { step: 7, title: "Build 2 ML projects", duration: "4 weeks", done: false },
      { step: 8, title: "Learn Power BI or Tableau", duration: "2 weeks", done: false },
      { step: 9, title: "Create your data portfolio", duration: "2 weeks", done: false },
      { step: 10, title: "Apply for data analyst/scientist roles", duration: "ongoing", done: false },
    ],
  },
  {
    id: "5", title: "Cloud Engineering with AWS", mentor: { name: "Emeka Nwosu", avatar: "EN", color: "#0ea5e9", role: "Cloud Engineer @ AWS" },
    field: "DevOps / Cloud", level: "Intermediate", duration: "5 months", steps: 9, saves: 112, color: "#0ea5e9",
    description: "Get AWS certified and land a cloud engineering role. Learn core AWS services, DevOps practices, and build real infrastructure projects.",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    outline: [
      { step: 1, title: "Linux & networking fundamentals", duration: "2 weeks", done: false },
      { step: 2, title: "AWS core services (EC2, S3, IAM)", duration: "2 weeks", done: false },
      { step: 3, title: "AWS Solutions Architect - Associate prep", duration: "4 weeks", done: false },
      { step: 4, title: "Get AWS certified", duration: "exam", done: false },
      { step: 5, title: "Docker & containerization", duration: "2 weeks", done: false },
      { step: 6, title: "Kubernetes basics", duration: "2 weeks", done: false },
      { step: 7, title: "CI/CD pipelines", duration: "1 week", done: false },
      { step: 8, title: "Infrastructure as code (Terraform)", duration: "2 weeks", done: false },
      { step: 9, title: "Build and deploy a real cloud project", duration: "3 weeks", done: false },
    ],
  },
];

const fields = ["All fields", "Software Engineering", "Product Management", "UI/UX Design", "Data Science", "DevOps / Cloud"];
const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];

function RoadmapCard({ roadmap, onOpen }) {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Color bar */}
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${roadmap.color}, ${roadmap.color}88)` }} />

      <div style={{ padding: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div style={{ flex: 1, marginRight: "8px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "4px", lineHeight: "1.3" }}>{roadmap.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: `linear-gradient(135deg, ${roadmap.mentor.color}cc, ${roadmap.mentor.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "8px" }}>
                {roadmap.mentor.avatar}
              </div>
              <span style={{ fontSize: "11px", color: "#64748b" }}>{roadmap.mentor.name}</span>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} style={{ background: saved ? "#fef2f2" : "#f8fafc", border: `1px solid ${saved ? "#fecaca" : "#e5e7eb"}`, borderRadius: "8px", padding: "5px 7px", cursor: "pointer", fontSize: "12px", flexShrink: 0 }}>
            {saved ? "❤️" : "🤍"}
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6", marginBottom: "14px" }}>{roadmap.description.slice(0, 100)}...</p>

        {/* Tags */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "14px" }}>
          {roadmap.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ background: `${roadmap.color}12`, color: roadmap.color, fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "5px" }}>{tag}</span>
          ))}
          {roadmap.tags.length > 3 && <span style={{ fontSize: "10px", color: "#94a3b8", padding: "3px 6px" }}>+{roadmap.tags.length - 3}</span>}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "16px", paddingTop: "12px", borderTop: "1px solid #f8fafc" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>📋 {roadmap.steps} steps</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>⏱️ {roadmap.duration}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>🔖 {roadmap.saves} saves</div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: roadmap.level === "Beginner" ? "#10b981" : roadmap.level === "Intermediate" ? "#f59e0b" : "#ef4444", background: roadmap.level === "Beginner" ? "#f0fdf4" : roadmap.level === "Intermediate" ? "#fffbeb" : "#fef2f2", padding: "2px 8px", borderRadius: "5px" }}>
              {roadmap.level}
            </span>
          </div>
        </div>

        <button onClick={() => onOpen(roadmap)} style={{ width: "100%", background: `linear-gradient(135deg, ${roadmap.color}, ${roadmap.color}cc)`, color: "white", border: "none", padding: "10px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
          View roadmap →
        </button>
      </div>
    </div>
  );
}

function RoadmapModal({ roadmap, onClose }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (step) => {
    setCompletedSteps(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const progress = Math.round((completedSteps.length / roadmap.steps) * 100);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "600px", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "24px 24px 0", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{roadmap.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: `linear-gradient(135deg, ${roadmap.mentor.color}cc, ${roadmap.mentor.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "9px" }}>
                  {roadmap.mentor.avatar}
                </div>
                <span style={{ fontSize: "12px", color: "#64748b" }}>by {roadmap.mentor.name} · {roadmap.mentor.role}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151" }}>Your progress</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: roadmap.color }}>{completedSteps.length}/{roadmap.steps} steps · {progress}%</span>
            </div>
            <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${roadmap.color}, ${roadmap.color}cc)`, borderRadius: "100px", transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #f1f5f9", marginBottom: "0" }} />
        </div>

        {/* Description */}
        <div style={{ padding: "16px 24px" }}>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", marginBottom: "16px" }}>{roadmap.description}</p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
            {roadmap.tags.map(tag => (
              <span key={tag} style={{ background: `${roadmap.color}12`, color: roadmap.color, fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" }}>{tag}</span>
            ))}
          </div>

          {/* Steps */}
          <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", marginBottom: "14px" }}>Roadmap steps</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {roadmap.outline.map((item, i) => {
              const done = completedSteps.includes(item.step);
              return (
                <div key={item.step} onClick={() => toggleStep(item.step)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", border: done ? `1px solid ${roadmap.color}33` : "1px solid #f1f5f9", background: done ? `${roadmap.color}08` : "#fafafa", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: done ? roadmap.color : "white", border: done ? "none" : "2px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {done ? <span style={{ color: "white", fontSize: "11px" }}>✓</span> : <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8" }}>{item.step}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: done ? "#64748b" : "#0f172a", textDecoration: done ? "line-through" : "none" }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>{item.duration}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to={`/mentors/${roadmap.id}`} style={{ flex: 1, textAlign: "center", background: `linear-gradient(135deg, ${roadmap.color}, ${roadmap.color}cc)`, color: "white", textDecoration: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "13px" }}>
              Book a session with {roadmap.mentor.name.split(" ")[0]} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapsContent() {
  const [selectedField, setSelectedField] = useState("All fields");
  const [selectedLevel, setSelectedLevel] = useState("All levels");
  const [search, setSearch] = useState("");
  const [openRoadmap, setOpenRoadmap] = useState(null);

  const filtered = roadmaps.filter(r => {
    const matchField = selectedField === "All fields" || r.field === selectedField;
    const matchLevel = selectedLevel === "All levels" || r.level === selectedLevel;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.field.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchField && matchLevel && matchSearch;
  });

  return (
    <div style={{ padding: "32px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>Career Roadmaps</h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Step-by-step guides created by verified mentors to get you to your dream career.</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roadmaps by title, field or skill..."
          style={{ width: "100%", padding: "13px 16px 13px 44px", borderRadius: "12px", fontSize: "14px", border: "2px solid #e5e7eb", background: "white", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
        <select value={selectedField} onChange={e => setSelectedField(e.target.value)} style={{ padding: "9px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white", outline: "none", cursor: "pointer" }}>
          {fields.map(f => <option key={f}>{f}</option>)}
        </select>
        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} style={{ padding: "9px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white", outline: "none", cursor: "pointer" }}>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{filtered.length} roadmap{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filtered.map(roadmap => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} onOpen={setOpenRoadmap} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No roadmaps found</h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Try adjusting your filters.</p>
        </div>
      )}

      {/* Modal */}
      {openRoadmap && <RoadmapModal roadmap={openRoadmap} onClose={() => setOpenRoadmap(null)} />}
    </div>
  );
}

export default function Roadmaps() {
  return (
    <MenteeLayout>
      <RoadmapsContent />
    </MenteeLayout>
  );
}
