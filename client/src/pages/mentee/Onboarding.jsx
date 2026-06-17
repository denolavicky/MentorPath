import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setCredentials } from "../../store/slices/authSlice.js";
import { usersAPI } from "../../api/index.js";

const TOTAL_STEPS = 6;

const careerFields = [
  { label: "Software Engineering", icon: "💻", color: "#6366f1" },
  { label: "Product Management", icon: "📦", color: "#10b981" },
  { label: "UI/UX Design", icon: "🎨", color: "#f59e0b" },
  { label: "Data Science", icon: "📊", color: "#8b5cf6" },
  { label: "Cybersecurity", icon: "🔐", color: "#ef4444" },
  { label: "DevOps / Cloud", icon: "☁️", color: "#0ea5e9" },
  { label: "Digital Marketing", icon: "📣", color: "#f97316" },
  { label: "Finance & Fintech", icon: "💰", color: "#14b8a6" },
  { label: "Business & Strategy", icon: "📈", color: "#6366f1" },
  { label: "Content & Media", icon: "✍️", color: "#ec4899" },
  { label: "Other", icon: "🌟", color: "#94a3b8" },
];

const situations = [
  { label: "I'm currently a student", icon: "🎓", desc: "Still in university or college" },
  { label: "I just graduated", icon: "🏆", desc: "Finished school, looking to start" },
  { label: "I'm switching careers", icon: "🔄", desc: "Working but want to change fields" },
  { label: "I have no experience yet", icon: "🌱", desc: "Starting completely from scratch" },
  { label: "I'm self-taught", icon: "📚", desc: "Learning on my own, need direction" },
];

const challenges = [
  { label: "I don't know where to start", icon: "🧭" },
  { label: "I lack the right skills", icon: "🛠️" },
  { label: "I have no portfolio or experience", icon: "📁" },
  { label: "I don't know how to network", icon: "🤝" },
  { label: "I keep getting rejected", icon: "💔" },
  { label: "I don't know what companies want", icon: "🏢" },
  { label: "I'm overwhelmed and don't know what to learn", icon: "😵" },
  { label: "I have no one to guide me", icon: "🙋" },
];

const helpTypes = [
  { label: "A clear career roadmap", icon: "🗺️", desc: "Step by step path to my goal" },
  { label: "Skill building guidance", icon: "🛠️", desc: "What to learn and in what order" },
  { label: "Portfolio & project reviews", icon: "👁️", desc: "Feedback on my work" },
  { label: "Job application help", icon: "📝", desc: "CV, cover letter, interviews" },
  { label: "Industry insider knowledge", icon: "🔑", desc: "How things really work" },
  { label: "Accountability & motivation", icon: "🔥", desc: "Someone to keep me on track" },
];

const timelines = [
  { label: "As soon as possible", icon: "⚡", sub: "I'm ready to move fast" },
  { label: "Within 3 months", icon: "📅", sub: "Short term goal" },
  { label: "Within 6 months", icon: "🎯", sub: "Medium term goal" },
  { label: "Within 1 year", icon: "📆", sub: "Long term plan" },
  { label: "I'm not sure yet", icon: "🤔", sub: "Help me figure it out" },
];

function ProgressBar({ step, total }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>Step {step} of {total}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#6366f1" }}>{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(step / total) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: "100px", transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function SelectCard({ item, selected, onSelect, multi }) {
  const isSelected = multi ? selected.includes(item.label) : selected === item.label;
  return (
    <button onClick={() => onSelect(item.label)} style={{
      background: isSelected ? "linear-gradient(135deg, #eef2ff, #f0f0ff)" : "white",
      border: isSelected ? "2px solid #6366f1" : "2px solid #e5e7eb",
      borderRadius: "14px", padding: "16px", cursor: "pointer",
      textAlign: "left", transition: "all 0.2s", width: "100%",
      display: "flex", alignItems: "center", gap: "12px",
    }}>
      <span style={{ fontSize: "24px", flexShrink: 0 }}>{item.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "700", fontSize: "14px", color: isSelected ? "#6366f1" : "#0f172a" }}>{item.label}</div>
        {item.desc && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.desc}</div>}
        {item.sub && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.sub}</div>}
      </div>
      {isSelected && <span style={{ color: "#6366f1", fontSize: "18px", flexShrink: 0 }}>✓</span>}
    </button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    careerField: "",
    careerGoal: "",
    situation: "",
    challenges: [],
    helpNeeded: [],
    timeline: "",
    bio: "",
  });

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const toggleMulti = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return data.careerField && data.careerGoal.trim().length > 5;
    if (step === 3) return data.situation;
    if (step === 4) return data.challenges.length > 0;
    if (step === 5) return data.helpNeeded.length > 0;
    if (step === 6) return data.timeline;
    return true;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: updated } = await usersAPI.updateProfile({
        careerField: data.careerField,
        careerGoal: data.careerGoal,
        situation: data.situation,
        challenges: data.challenges,
        helpNeeded: data.helpNeeded,
        timeline: data.timeline,
        bio: data.bio,
        onboardingComplete: true,
      });
      if (updated?.user) {
        dispatch(setCredentials({ user: updated.user, token: localStorage.getItem("token") }));
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding save error:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fafafa 0%, #f0f0ff 50%, #faf5ff 100%)", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Left panel */}
      <div style={{ width: "380px", background: "linear-gradient(160deg, #0f172a, #1e1b4b)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "16px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>MentorPath</span>
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "white", lineHeight: "1.3", marginBottom: "16px" }}>
            Let's build your personal career roadmap
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", marginBottom: "40px" }}>
            Answer a few questions and we'll map out the exact steps, skills, and timeline to get you to your dream career.
          </p>

          {/* Step indicators */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "Welcome",
              "Your career goal",
              "Where you are now",
              "Your challenges",
              "What you need",
              "Your timeline",
            ].map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done ? "#10b981" : active ? "#6366f1" : "rgba(255,255,255,0.08)", border: done ? "none" : active ? "none" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                    {done ? <span style={{ color: "white", fontSize: "12px" }}>✓</span> : <span style={{ color: active ? "white" : "#475569", fontSize: "11px", fontWeight: "700" }}>{s}</span>}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: active ? "700" : "500", color: active ? "white" : done ? "#94a3b8" : "#475569" }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ color: "#334155", fontSize: "12px", position: "relative", zIndex: 1 }}>© 2024 MentorPath</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 5%", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "560px" }}>

          <ProgressBar step={step} total={TOTAL_STEPS} />

          {/* ── STEP 1: Welcome ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👋</div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>
                Welcome, {user?.name?.split(" ")[0]}!
              </h1>
              <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
                We're about to set up your personal career roadmap. This takes about <strong>2 minutes</strong> and will help us:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {[
                  { icon: "🎯", text: "Understand exactly where you want to go" },
                  { icon: "🗺️", text: "Map out the exact steps to get you there" },
                  { icon: "⏱️", text: "Give you a realistic timeline" },
                  { icon: "👤", text: "Match you with the perfect mentor for your goals" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "white", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Career goal ── */}
          {step === 2 && (
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>What's your dream career?</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>Pick the field you want to break into.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {careerFields.map((field) => {
                  const isSelected = data.careerField === field.label;
                  return (
                    <button key={field.label} onClick={() => update("careerField", field.label)} style={{
                      background: isSelected ? `${field.color}15` : "white",
                      border: isSelected ? `2px solid ${field.color}` : "2px solid #e5e7eb",
                      borderRadius: "12px", padding: "14px", cursor: "pointer",
                      textAlign: "left", transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: "10px",
                    }}>
                      <span style={{ fontSize: "20px" }}>{field.icon}</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? field.color : "#374151" }}>{field.label}</span>
                      {isSelected && <span style={{ marginLeft: "auto", color: field.color }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
                  Describe your goal in your own words
                </label>
                <textarea
                  value={data.careerGoal}
                  onChange={e => update("careerGoal", e.target.value)}
                  placeholder='e.g. "I want to become a frontend developer and land a job at a tech startup by the end of 2025"'
                  rows={3}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.6" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Current situation ── */}
          {step === 3 && (
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Where are you right now?</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>This helps us understand your starting point.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {situations.map((item) => (
                  <SelectCard key={item.label} item={item} selected={data.situation} onSelect={(val) => update("situation", val)} />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Challenges ── */}
          {step === 4 && (
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>What are your challenges?</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>Select all that apply — be honest, this is just for us to help you better.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {challenges.map((item) => (
                  <SelectCard key={item.label} item={item} selected={data.challenges} onSelect={(val) => toggleMulti("challenges", val)} multi />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: What they need ── */}
          {step === 5 && (
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>What do you need most?</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>Pick everything that applies — your mentor will focus on these areas.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {helpTypes.map((item) => (
                  <SelectCard key={item.label} item={item} selected={data.helpNeeded} onSelect={(val) => toggleMulti("helpNeeded", val)} multi />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 6: Timeline ── */}
          {step === 6 && (
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>When do you want to get there?</h1>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>Give us a realistic target — your mentor will help you get there.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {timelines.map((item) => (
                  <SelectCard key={item.label} item={item} selected={data.timeline} onSelect={(val) => update("timeline", val)} />
                ))}
              </div>

              {/* Optional bio */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
                  Anything else you want your mentor to know? <span style={{ color: "#94a3b8", fontWeight: "500" }}>(optional)</span>
                </label>
                <textarea
                  value={data.bio}
                  onChange={e => update("bio", e.target.value)}
                  placeholder="e.g. background, previous experience, specific things you want help with..."
                  rows={3}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.6" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Summary card */}
              {data.careerField && (
                <div style={{ marginTop: "24px", background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Your career profile summary</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "13px", color: "#64748b", minWidth: "100px" }}>Goal:</span><span style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>{data.careerField}</span></div>
                    {data.careerGoal && <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "13px", color: "#64748b", minWidth: "100px" }}>In their words:</span><span style={{ fontSize: "13px", color: "#cbd5e1", fontStyle: "italic" }}>"{data.careerGoal}"</span></div>}
                    <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "13px", color: "#64748b", minWidth: "100px" }}>Situation:</span><span style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>{data.situation}</span></div>
                    {data.timeline && <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "13px", color: "#64748b", minWidth: "100px" }}>Timeline:</span><span style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>{data.timeline}</span></div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── NAVIGATION ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "36px" }}>
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
              style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}
            >
              {step === 1 ? "Skip for now" : "← Back"}
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                style={{ background: canNext() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb", color: canNext() ? "white" : "#94a3b8", padding: "12px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: canNext() ? "pointer" : "not-allowed", border: "none", boxShadow: canNext() ? "0 4px 14px rgba(99,102,241,0.4)" : "none", transition: "all 0.2s" }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext() || loading}
                style={{ background: canNext() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb", color: canNext() ? "white" : "#94a3b8", padding: "12px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: canNext() ? "pointer" : "not-allowed", border: "none", boxShadow: canNext() ? "0 4px 14px rgba(99,102,241,0.4)" : "none", transition: "all 0.2s" }}
              >
                {loading ? "Saving..." : "Complete setup 🎉"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
