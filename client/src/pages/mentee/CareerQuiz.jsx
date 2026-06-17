import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";

const questions = [
  {
    id: 1,
    question: "What type of work excites you most?",
    options: [
      { label: "Building things — apps, systems, products", value: "builder" },
      { label: "Solving problems and analysing data", value: "analyst" },
      { label: "Designing beautiful and intuitive experiences", value: "designer" },
      { label: "Leading teams and shaping strategy", value: "leader" },
    ],
  },
  {
    id: 2,
    question: "Which of these sounds most like you?",
    options: [
      { label: "I love figuring out how things work technically", value: "technical" },
      { label: "I'm great at understanding people and their needs", value: "people" },
      { label: "I love patterns, numbers, and making sense of data", value: "data" },
      { label: "I think visually and care deeply about aesthetics", value: "visual" },
    ],
  },
  {
    id: 3,
    question: "What environment do you thrive in?",
    options: [
      { label: "Fast-paced startups where I wear many hats", value: "startup" },
      { label: "Structured corporate environments with clear processes", value: "corporate" },
      { label: "Creative studios or agencies", value: "creative" },
      { label: "Remote, independent work with flexible hours", value: "remote" },
    ],
  },
  {
    id: 4,
    question: "What's your biggest strength?",
    options: [
      { label: "Logic and systematic thinking", value: "logic" },
      { label: "Creativity and visual communication", value: "creativity" },
      { label: "Communication and persuasion", value: "communication" },
      { label: "Research and critical analysis", value: "research" },
    ],
  },
  {
    id: 5,
    question: "Which outcome matters most to you in your work?",
    options: [
      { label: "Building products millions of people use", value: "scale" },
      { label: "Making data-driven decisions that impact the business", value: "impact" },
      { label: "Creating experiences that delight users", value: "delight" },
      { label: "Earning well and having career stability", value: "stability" },
    ],
  },
];

const results = {
  "Software Engineering": {
    field: "Software Engineering",
    icon: "💻",
    color: "#6366f1",
    description: "You love building things and think logically. Software engineering lets you create products that scale to millions of users. It's one of the most in-demand and well-paying careers globally.",
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "DevOps Engineer"],
    salaryRange: "$30,000 - $150,000+",
    timeToFirstJob: "6 - 12 months",
    difficulty: "Medium",
    mentors: ["Amara Okafor", "Emeka Nwosu"],
    firstSteps: ["Learn HTML, CSS & JavaScript", "Pick a framework (React or Vue)", "Build 2-3 real projects", "Put your code on GitHub", "Start applying"],
  },
  "UI/UX Design": {
    field: "UI/UX Design",
    icon: "🎨",
    color: "#f59e0b",
    description: "You think visually and care deeply about how things look and feel. UX designers are in high demand as companies realise that great design drives revenue.",
    roles: ["UI Designer", "UX Designer", "Product Designer", "Interaction Designer", "UX Researcher"],
    salaryRange: "$25,000 - $120,000+",
    timeToFirstJob: "5 - 10 months",
    difficulty: "Medium",
    mentors: ["Chioma Eze"],
    firstSteps: ["Learn Figma (it's free)", "Study UX principles", "Do 3 redesign projects", "Build a portfolio with case studies", "Start applying to junior roles"],
  },
  "Product Management": {
    field: "Product Management",
    icon: "📦",
    color: "#10b981",
    description: "You're a natural leader who loves strategy and understanding people. Product managers sit at the intersection of tech, business, and design — and they're very well paid.",
    roles: ["Associate Product Manager", "Product Manager", "Senior PM", "Product Lead", "VP of Product"],
    salaryRange: "$35,000 - $180,000+",
    timeToFirstJob: "6 - 18 months",
    difficulty: "Hard",
    mentors: ["Tunde Adeyemi"],
    firstSteps: ["Learn PM frameworks (RICE, MoSCoW)", "Write 2 product case studies", "Study metrics and analytics", "Network with PMs on LinkedIn", "Apply to APM programmes"],
  },
  "Data Science": {
    field: "Data Science",
    icon: "📊",
    color: "#8b5cf6",
    description: "You love patterns, numbers, and making sense of complex information. Data science is one of the fastest-growing fields with exceptional earning potential.",
    roles: ["Data Analyst", "Data Scientist", "ML Engineer", "Business Intelligence Analyst", "Data Engineer"],
    salaryRange: "$28,000 - $130,000+",
    timeToFirstJob: "8 - 18 months",
    difficulty: "Hard",
    mentors: ["Kwame Mensah"],
    firstSteps: ["Learn Python basics", "Learn statistics fundamentals", "Master Pandas and data visualisation", "Build 2 ML projects", "Get comfortable with SQL"],
  },
  "Digital Marketing": {
    field: "Digital Marketing",
    icon: "📣",
    color: "#f97316",
    description: "You're creative, love communicating, and understand what makes people tick. Digital marketing lets you combine creativity with data to drive real business results.",
    roles: ["Digital Marketer", "Content Strategist", "SEO Specialist", "Social Media Manager", "Growth Marketer"],
    salaryRange: "$20,000 - $80,000+",
    timeToFirstJob: "3 - 8 months",
    difficulty: "Easy",
    mentors: ["Aisha Diallo"],
    firstSteps: ["Learn Google Analytics", "Master one platform (Instagram, TikTok, or LinkedIn)", "Run a small ad campaign ($5 budget)", "Build a content portfolio", "Get Google certifications (free)"],
  },
};

function getResult(answers) {
  const scores = {
    "Software Engineering": 0,
    "UI/UX Design": 0,
    "Product Management": 0,
    "Data Science": 0,
    "Digital Marketing": 0,
  };

  const mapping = {
    builder: { "Software Engineering": 3 },
    analyst: { "Data Science": 3 },
    designer: { "UI/UX Design": 3 },
    leader: { "Product Management": 3 },
    technical: { "Software Engineering": 2, "Data Science": 1 },
    people: { "Product Management": 2, "Digital Marketing": 1 },
    data: { "Data Science": 2, "Product Management": 1 },
    visual: { "UI/UX Design": 2, "Digital Marketing": 1 },
    startup: { "Software Engineering": 1, "Product Management": 1 },
    corporate: { "Data Science": 1, "Product Management": 1 },
    creative: { "UI/UX Design": 2, "Digital Marketing": 1 },
    remote: { "Software Engineering": 1, "Digital Marketing": 1 },
    logic: { "Software Engineering": 2, "Data Science": 2 },
    creativity: { "UI/UX Design": 2, "Digital Marketing": 1 },
    communication: { "Product Management": 2, "Digital Marketing": 2 },
    research: { "Data Science": 2, "UI/UX Design": 1 },
    scale: { "Software Engineering": 2, "Product Management": 1 },
    impact: { "Data Science": 2, "Product Management": 1 },
    delight: { "UI/UX Design": 2 },
    stability: { "Software Engineering": 1, "Data Science": 1 },
  };

  answers.forEach(answer => {
    const map = mapping[answer] || {};
    Object.entries(map).forEach(([field, score]) => {
      scores[field] = (scores[field] || 0) + score;
    });
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function QuizContent() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  const handleSelect = (value) => setSelectedOption(value);

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = [...answers, selectedOption];

    if (currentQ === questions.length - 1) {
      const field = getResult(newAnswers);
      setResult(results[field]);
    } else {
      setAnswers(newAnswers);
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
    setStarted(false);
  };

  // Intro screen
  if (!started) {
    return (
      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "48px 40px", border: "1px solid #f1f5f9", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎯</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>Career Path Quiz</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>
            Not sure which career is right for you? Answer 5 quick questions and we'll show you the best path based on your personality, strengths, and goals.
          </p>
          <div style={{ display: "flex", justify: "center", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
            {[["5 questions", "⚡"], ["2 minutes", "⏱️"], ["Personalised result", "🎯"]].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "8px 16px", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <span>{icon}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "14px 36px", borderRadius: "12px", fontWeight: "800", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
            Start quiz →
          </button>
        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div style={{ padding: "32px", maxWidth: "680px" }}>
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
          {/* Result header */}
          <div style={{ background: `linear-gradient(135deg, ${result.color}22, ${result.color}08)`, padding: "36px 32px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>{result.icon}</div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: result.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Your best career match</p>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>{result.field}</h1>
            <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.7", maxWidth: "500px", margin: "0 auto" }}>{result.description}</p>
          </div>

          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

              {/* Roles */}
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Common roles</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {result.roles.map(role => (
                    <div key={role} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                      <span style={{ color: result.color }}>→</span> {role}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  ["💰 Salary range", result.salaryRange],
                  ["⏱️ Time to first job", result.timeToFirstJob],
                  ["📊 Difficulty", result.difficulty],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "12px", background: "#fafafa", borderRadius: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* First steps */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your first 5 steps</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.firstSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", background: "#fafafa", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `linear-gradient(135deg, ${result.color}, ${result.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: "800", flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/explore" style={{ flex: 1, textAlign: "center", background: `linear-gradient(135deg, ${result.color}, ${result.color}cc)`, color: "white", textDecoration: "none", padding: "13px", borderRadius: "12px", fontWeight: "700", fontSize: "14px" }}>
                Find a {result.field} mentor →
              </Link>
              <button onClick={handleRestart} style={{ padding: "13px 20px", borderRadius: "12px", border: "1px solid #e5e7eb", background: "white", color: "#374151", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                Retake quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div style={{ padding: "32px", maxWidth: "580px" }}>

      {/* Progress */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Question {currentQ + 1} of {questions.length}</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#6366f1" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "100px", transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "24px", lineHeight: "1.3" }}>{question.question}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {question.options.map(option => {
            const isSelected = selectedOption === option.value;
            return (
              <button key={option.value} onClick={() => handleSelect(option.value)} style={{
                padding: "16px 18px", borderRadius: "12px", textAlign: "left",
                border: isSelected ? "2px solid #6366f1" : "2px solid #e5e7eb",
                background: isSelected ? "linear-gradient(135deg, #eef2ff, #f0f0ff)" : "white",
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "14px", fontWeight: isSelected ? "700" : "500", color: isSelected ? "#6366f1" : "#374151" }}>
                  {option.label}
                </span>
                {isSelected && <span style={{ color: "#6366f1", fontSize: "16px" }}>✓</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => { if (currentQ > 0) { setCurrentQ(prev => prev - 1); setSelectedOption(answers[currentQ - 1] || null); setAnswers(prev => prev.slice(0, -1)); } }} disabled={currentQ === 0} style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", padding: "11px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: currentQ === 0 ? "not-allowed" : "pointer", opacity: currentQ === 0 ? 0.5 : 1 }}>
            ← Back
          </button>
          <button onClick={handleNext} disabled={!selectedOption} style={{ background: selectedOption ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb", color: selectedOption ? "white" : "#94a3b8", border: "none", padding: "11px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: selectedOption ? "pointer" : "not-allowed", boxShadow: selectedOption ? "0 4px 14px rgba(99,102,241,0.4)" : "none" }}>
            {currentQ === questions.length - 1 ? "See my result →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CareerQuiz() {
  return (
    <MenteeLayout>
      <QuizContent />
    </MenteeLayout>
  );
}
