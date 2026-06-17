import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setCredentials } from "../../store/slices/authSlice.js";
import { mentorsAPI } from "../../api/index.js";

const STEPS = ["Personal info", "Professional background", "Mentorship details", "Review & submit"];

const careerFields = [
  "Software Engineering", "Product Management", "UI/UX Design", "Data Science",
  "Cybersecurity", "DevOps / Cloud", "Digital Marketing", "Finance & Fintech",
  "Business & Strategy", "Content & Media", "Other",
];

const skillOptions = {
  "Software Engineering": ["React", "Node.js", "Python", "System Design", "TypeScript", "AWS", "Docker", "GraphQL"],
  "Product Management": ["Product Strategy", "Agile", "UX Research", "Roadmapping", "Stakeholder Management", "Data Analysis"],
  "UI/UX Design": ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing", "Adobe XD"],
  "Data Science": ["Python", "Machine Learning", "SQL", "Power BI", "TensorFlow", "Data Visualization"],
  "Cybersecurity": ["Penetration Testing", "Network Security", "SIEM", "CompTIA", "Ethical Hacking"],
  "DevOps / Cloud": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
  "Digital Marketing": ["SEO", "Paid Ads", "Content Strategy", "Analytics", "Social Media", "Email Marketing"],
  "Finance & Fintech": ["Financial Analysis", "Fintech", "Investment", "Risk Management", "Blockchain"],
  "Business & Strategy": ["Business Development", "Strategy", "Operations", "Leadership", "Consulting"],
  "Content & Media": ["Content Writing", "Video Production", "Journalism", "Brand Strategy", "Copywriting"],
  "Other": ["Communication", "Leadership", "Project Management", "Public Speaking", "Networking"],
};

const sessionPrices = [
  { label: "Free", value: 0, desc: "Build your reputation first" },
  { label: "$10", value: 10, desc: "Entry level" },
  { label: "$15", value: 15, desc: "Affordable" },
  { label: "$20", value: 20, desc: "Standard" },
  { label: "$25", value: 25, desc: "Professional" },
  { label: "$30", value: 30, desc: "Senior level" },
  { label: "$35+", value: 35, desc: "Expert level" },
];

function StepIndicator({ currentStep, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "36px" }}>
      {STEPS.map((step, i) => {
        const num = i + 1;
        const done = currentStep > num;
        const active = currentStep === num;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: done || active ? color : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done ? <span style={{ color: "white", fontSize: "13px" }}>✓</span> : <span style={{ fontSize: "12px", fontWeight: "700", color: active ? "white" : "#94a3b8" }}>{num}</span>}
              </div>
              <span style={{ fontSize: "12px", fontWeight: active ? "700" : "500", color: active ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap" }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: done ? color : "#f1f5f9", margin: "0 10px" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function ApplyMentor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Step 1
    headline: "",
    linkedIn: "",
    website: "",
    country: "",
    languages: "",
    // Step 2
    field: "",
    company: "",
    jobTitle: "",
    yearsExperience: "",
    skills: [],
    bio: "",
    // Step 3
    sessionPrice: 20,
    availability: [],
    whyMentor: "",
    helpWith: [],
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleHelpWith = (item) => {
    setForm(prev => ({
      ...prev,
      helpWith: prev.helpWith.includes(item)
        ? prev.helpWith.filter(h => h !== item)
        : [...prev.helpWith, item],
    }));
  };

  const toggleAvailability = (slot) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(a => a !== slot)
        : [...prev.availability, slot],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.headline && form.country;
    if (step === 2) return form.field && form.company && form.jobTitle && form.yearsExperience && form.bio.length > 50;
    if (step === 3) return form.whyMentor.length > 30 && form.helpWith.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await mentorsAPI.apply(form);
      navigate("/mentor/status");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const color = "#8b5cf6";

  const InputField = ({ label, name, placeholder, type = "text", required }) => (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        type={type} value={form[name]} onChange={e => update(name, e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = color}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "0 5%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>MentorPath</span>
          </Link>
          <Link to="/dashboard" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", fontWeight: "600" }}>← Back to dashboard</Link>
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 5%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌟</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Apply to become a mentor</h1>
          <p style={{ color: "#64748b", fontSize: "15px" }}>Share your expertise and help the next generation of African professionals.</p>
        </div>

        <StepIndicator currentStep={step} color={color} />

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Personal info ── */}
        {step === 1 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Tell us about yourself</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <InputField label="Professional headline" name="headline" placeholder='e.g. "Senior Software Engineer at Google"' required />
              <InputField label="Country" name="country" placeholder="e.g. Nigeria" required />
              <InputField label="LinkedIn profile" name="linkedIn" placeholder="https://linkedin.com/in/yourname" />
              <InputField label="Website / Portfolio" name="website" placeholder="https://yourwebsite.com" />
              <InputField label="Languages spoken" name="languages" placeholder="e.g. English, Yoruba, French" />
            </div>
          </div>
        )}

        {/* ── STEP 2: Professional background ── */}
        {step === 2 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Your professional background</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Field */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Career field <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {careerFields.map(f => (
                    <button key={f} onClick={() => update("field", f)} style={{ padding: "10px 14px", borderRadius: "10px", border: form.field === f ? `2px solid ${color}` : "2px solid #e5e7eb", background: form.field === f ? `${color}10` : "white", color: form.field === f ? color : "#374151", fontWeight: "600", fontSize: "13px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <InputField label="Current company" name="company" placeholder="e.g. Google" required />
                <InputField label="Job title" name="jobTitle" placeholder="e.g. Senior Engineer" required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Years of experience <span style={{ color: "#ef4444" }}>*</span></label>
                <select value={form.yearsExperience} onChange={e => update("yearsExperience", e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white" }}>
                  <option value="">Select years</option>
                  {["1-2 years", "3-4 years", "5-7 years", "8-10 years", "10+ years"].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* Skills */}
              {form.field && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Skills & expertise</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(skillOptions[form.field] || []).map(skill => (
                      <button key={skill} onClick={() => toggleSkill(skill)} style={{ padding: "6px 14px", borderRadius: "8px", border: form.skills.includes(skill) ? `2px solid ${color}` : "2px solid #e5e7eb", background: form.skills.includes(skill) ? `${color}10` : "white", color: form.skills.includes(skill) ? color : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Professional bio <span style={{ color: "#ef4444" }}>*</span></label>
                <textarea value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Tell mentees about your background, experience, and what makes you a great mentor. Be specific about what you can help with..." rows={5}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.6" }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <p style={{ fontSize: "11px", color: form.bio.length < 50 ? "#ef4444" : "#94a3b8", marginTop: "4px" }}>
                  {form.bio.length}/50 minimum characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Mentorship details ── */}
        {step === 3 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Your mentorship approach</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Session price */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Session price (per 60 mins)</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {sessionPrices.map(p => (
                    <button key={p.value} onClick={() => update("sessionPrice", p.value)} style={{ padding: "12px 8px", borderRadius: "10px", border: form.sessionPrice === p.value ? `2px solid ${color}` : "2px solid #e5e7eb", background: form.sessionPrice === p.value ? `${color}10` : "white", color: form.sessionPrice === p.value ? color : "#374151", fontWeight: "700", fontSize: "13px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                      <div>{p.label}</div>
                      <div style={{ fontSize: "10px", fontWeight: "500", color: "#94a3b8", marginTop: "2px" }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>When are you available?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["Weekday mornings (6AM - 12PM)", "Weekday afternoons (12PM - 6PM)", "Weekday evenings (6PM - 10PM)", "Weekend mornings (9AM - 12PM)", "Weekend afternoons (12PM - 6PM)"].map(slot => (
                    <button key={slot} onClick={() => toggleAvailability(slot)} style={{ padding: "11px 14px", borderRadius: "10px", border: form.availability.includes(slot) ? `2px solid ${color}` : "2px solid #e5e7eb", background: form.availability.includes(slot) ? `${color}10` : "white", color: form.availability.includes(slot) ? color : "#374151", fontWeight: "600", fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {slot} {form.availability.includes(slot) && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* What can you help with */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>What can you help mentees with? <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Career roadmap", "Portfolio review", "Mock interviews", "Job applications", "Skill building", "Industry insights", "Networking", "Accountability"].map(item => (
                    <button key={item} onClick={() => toggleHelpWith(item)} style={{ padding: "7px 14px", borderRadius: "8px", border: form.helpWith.includes(item) ? `2px solid ${color}` : "2px solid #e5e7eb", background: form.helpWith.includes(item) ? `${color}10` : "white", color: form.helpWith.includes(item) ? color : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Why mentor */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Why do you want to mentor? <span style={{ color: "#ef4444" }}>*</span></label>
                <textarea value={form.whyMentor} onChange={e => update("whyMentor", e.target.value)} placeholder="Tell us your motivation for mentoring. What drove you to want to give back?" rows={4}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", border: "2px solid #e5e7eb", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.6" }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review ── */}
        {step === 4 && (
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Review your application</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                ["Name", user?.name],
                ["Headline", form.headline],
                ["Country", form.country],
                ["Field", form.field],
                ["Company", form.company],
                ["Job title", form.jobTitle],
                ["Experience", form.yearsExperience],
                ["Session price", form.sessionPrice === 0 ? "Free" : `$${form.sessionPrice}/session`],
                ["Skills", form.skills.join(", ") || "None selected"],
                ["Can help with", form.helpWith.join(", ") || "None selected"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", minWidth: "120px" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>{value || "—"}</span>
                </div>
              ))}

              <div style={{ padding: "14px 0" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "6px" }}>Bio</span>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{form.bio}</p>
              </div>
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 16px", marginTop: "20px" }}>
              <p style={{ fontSize: "13px", color: "#166534", fontWeight: "600" }}>📋 What happens next?</p>
              <p style={{ fontSize: "13px", color: "#166534", marginTop: "4px" }}>Our team will review your application within 2-3 business days. You'll be notified by email once a decision is made.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")} style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} style={{ background: canNext() ? `linear-gradient(135deg, ${color}, #a78bfa)` : "#e5e7eb", color: canNext() ? "white" : "#94a3b8", border: "none", padding: "12px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: canNext() ? "pointer" : "not-allowed", boxShadow: canNext() ? `0 4px 14px ${color}40` : "none" }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ background: `linear-gradient(135deg, ${color}, #a78bfa)`, color: "white", border: "none", padding: "12px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: `0 4px 14px ${color}40` }}>
              {loading ? "Submitting..." : "Submit application 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
