import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const featuredMentors = [
  { id: 1, name: "Amara Okafor", role: "Senior Software Engineer", company: "Google", skills: ["React", "Node.js", "System Design"], rating: 4.9, reviews: 134, price: 25, avatar: "AO", color: "#6366f1" },
  { id: 2, name: "Tunde Adeyemi", role: "Product Manager", company: "Flutterwave", skills: ["Product Strategy", "Agile", "UX"], rating: 4.8, reviews: 89, price: 20, avatar: "TA", color: "#10b981" },
  { id: 3, name: "Chioma Eze", role: "UX Design Lead", company: "Microsoft", skills: ["Figma", "User Research", "Prototyping"], rating: 5.0, reviews: 61, price: 30, avatar: "CE", color: "#f59e0b" },
];

const testimonials = [
  { quote: "I was completely lost after graduation. My mentor helped me land my first dev job in 3 months. Best investment I ever made.", name: "Emeka Nwosu", role: "Junior Frontend Developer", initial: "E", color: "#6366f1" },
  { quote: "I knew I wanted product management but had no idea how. My mentor gave me a clear roadmap and reviewed my portfolio.", name: "Fatima Bello", role: "Associate Product Manager", initial: "F", color: "#10b981" },
  { quote: "The career quiz alone changed how I thought about my options. Then my mentor helped me actually execute the plan.", name: "David Osei", role: "UI/UX Designer", initial: "D", color: "#f59e0b" },
];

const steps = [
  { number: "01", title: "Create your profile", description: "Tell us your background, goals, and the career path you want to pursue. Takes less than 5 minutes.", icon: "✦" },
  { number: "02", title: "Find your mentor", description: "Browse verified professionals in your field. Filter by skills, availability, price, and rating.", icon: "◈" },
  { number: "03", title: "Book a session", description: "Pick a time that works for you. Meet 1-on-1, get real guidance, and walk away with a clear next step.", icon: "◉" },
];

const painPoints = [
  "You've graduated but have no idea where to start",
  "You know what career you want but don't know how to break in",
  "You've watched 100 YouTube videos and you're still stuck",
];

const whyPoints = [
  { title: "Verified mentors only", desc: "Every mentor goes through an application and approval process. No randoms." },
  { title: "Real professionals", desc: "People who are actively working in the field — not just influencers." },
  { title: "Affordable sessions", desc: "Pay per session or go Pro. No expensive coaching programmes." },
  { title: "Career roadmaps included", desc: "Mentors post step-by-step guides you can follow on your own." },
];

function StarRating({ rating, reviews }) {
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb", fontSize: "12px" }}>★</span>
      ))}
      <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "4px" }}>{rating} ({reviews})</span>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111827", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #f3f4f6" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "16px", fontWeight: "800" }}>M</span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>MentorPath</span>
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <a href="#how-it-works" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>How it works</a>
              <Link to="/mentors" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Explore mentors</Link>
              <a href="#why" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Why MentorPath</a>
            </div>
          )}

          {/* Desktop auth buttons */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "600", padding: "8px 16px" }}>Log in</Link>
              <Link to="/register" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "600", padding: "10px 20px", borderRadius: "10px" }}>Get started free</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "#374151", padding: "4px" }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "16px 5% 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>How it works</a>
              <Link to="/mentors" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>Explore mentors</Link>
              <a href="#why" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 0" }}>Why MentorPath</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/login" style={{ textAlign: "center", color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "10px" }}>Log in</Link>
              <Link to="/register" style={{ textAlign: "center", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: "15px", fontWeight: "700", padding: "12px", borderRadius: "10px" }}>Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fafafa 0%, #f0f0ff 50%, #faf5ff 100%)", display: "flex", alignItems: "center", padding: isMobile ? "100px 5% 60px" : "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "60px", alignItems: "center", width: "100%" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e0e7ff", borderRadius: "100px", padding: "6px 14px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
              <span style={{ fontSize: "13px", color: "#6366f1", fontWeight: "600" }}>500+ verified mentors ready</span>
            </div>
            <h1 style={{ fontSize: isMobile ? "32px" : "clamp(36px, 5vw, 58px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px", color: "#0f172a" }}>
              Find a mentor who's{" "}
              <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>been where</span>
              {" "}you want to go
            </h1>
            <p style={{ fontSize: isMobile ? "16px" : "18px", color: "#64748b", lineHeight: "1.7", marginBottom: "36px" }}>
              Stop figuring it out alone. Connect with verified professionals who will show you the exact path to the career you want.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/register" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: isMobile ? "15px" : "16px", fontWeight: "700", padding: "14px 24px", borderRadius: "12px", boxShadow: "0 8px 24px rgba(99,102,241,0.4)", display: "inline-block" }}>Find my mentor →</Link>
              <Link to="/register" style={{ background: "white", color: "#374151", textDecoration: "none", fontSize: isMobile ? "15px" : "16px", fontWeight: "700", padding: "14px 24px", borderRadius: "12px", border: "2px solid #e5e7eb", display: "inline-block" }}>Become a mentor</Link>
            </div>
            <div style={{ display: "flex", gap: isMobile ? "20px" : "32px", marginTop: "48px", flexWrap: "wrap" }}>
              {[["500+", "Verified mentors"], ["2,000+", "Sessions booked"], ["4.9★", "Average rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "800", color: "#0f172a" }}>{num}</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — hidden on mobile to avoid overflow */}
          {!isMobile && (
            <div style={{ position: "relative", height: "480px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", width: "280px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "16px" }}>AO</div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>Amara Okafor</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Software Engineer @ Google</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
                  {["React", "Node.js", "System Design"].map(s => (
                    <span key={s} style={{ background: "#f0f0ff", color: "#6366f1", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <StarRating rating={4.9} reviews={134} />
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#6366f1" }}>$25/session</span>
                </div>
                <Link to="/register" style={{ display: "block", marginTop: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textAlign: "center", textDecoration: "none", padding: "10px", borderRadius: "10px", fontWeight: "700", fontSize: "13px" }}>Book a session</Link>
              </div>
              <div style={{ position: "absolute", top: "60px", right: "20px", background: "white", borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 4, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🎯</span>
                <div><div style={{ fontSize: "12px", fontWeight: "700" }}>Session booked!</div><div style={{ fontSize: "11px", color: "#6b7280" }}>Tomorrow, 3:00 PM</div></div>
              </div>
              <div style={{ position: "absolute", bottom: "80px", left: "10px", background: "white", borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 4, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>⚡</span>
                <div><div style={{ fontSize: "12px", fontWeight: "700" }}>Career path found</div><div style={{ fontSize: "11px", color: "#6b7280" }}>UI/UX → Product</div></div>
              </div>
              <div style={{ position: "absolute", top: "120px", left: "0", background: "#10b981", borderRadius: "14px", padding: "10px 14px", boxShadow: "0 8px 24px rgba(16,185,129,0.3)", zIndex: 4 }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "white" }}>✓ Mentor verified</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "#0f172a" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#6366f1", fontWeight: "700", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Sound familiar?</p>
          <h2 style={{ fontSize: isMobile ? "26px" : "clamp(28px, 4vw, 44px)", fontWeight: "800", color: "white", marginBottom: "40px", lineHeight: "1.2" }}>Most graduates feel completely lost — and that's not their fault</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {painPoints.map((point, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", textAlign: "left" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>😔</span>
                <span style={{ color: "#cbd5e1", fontSize: isMobile ? "14px" : "16px", fontWeight: "500" }}>{point}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "#94a3b8", marginTop: "36px", fontSize: isMobile ? "15px" : "17px", lineHeight: "1.7" }}>
            The problem isn't you — it's that you don't have access to someone who's already figured it out. <span style={{ color: "white", fontWeight: "700" }}>That's what MentorPath fixes.</span>
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#6366f1", fontWeight: "700", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Simple process</p>
            <h2 style={{ fontSize: isMobile ? "26px" : "clamp(28px, 4vw, 44px)", fontWeight: "800", color: "#0f172a" }}>How it works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: "#fafafa", borderRadius: "20px", padding: isMobile ? "28px 24px" : "36px 32px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#6366f1", marginBottom: "12px", letterSpacing: "0.05em" }}>{step.number}</div>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{step.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ color: "#64748b", lineHeight: "1.7", fontSize: "14px" }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section id="why" style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "linear-gradient(160deg, #fafafa, #f0f0ff)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
          <div>
            <p style={{ color: "#6366f1", fontWeight: "700", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Why us</p>
            <h2 style={{ fontSize: isMobile ? "26px" : "clamp(28px, 4vw, 42px)", fontWeight: "800", color: "#0f172a", marginBottom: "16px", lineHeight: "1.2" }}>Not just another platform</h2>
            <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>We built MentorPath specifically for African students and graduates who need real, credible guidance — not generic advice.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {whyPoints.map((point, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <span style={{ color: "white", fontSize: "11px", fontWeight: "800" }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", marginBottom: "3px" }}>{point.title}</div>
                    <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6" }}>{point.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "white", borderRadius: "24px", padding: isMobile ? "28px" : "40px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[["500+", "Verified mentors", "#6366f1"], ["15+", "Career fields", "#10b981"], ["2,000+", "Sessions completed", "#8b5cf6"], ["4.9/5", "Average rating", "#f59e0b"]].map(([num, label, color]) => (
                <div key={label} style={{ textAlign: "center", padding: isMobile ? "18px 12px" : "24px", background: "#fafafa", borderRadius: "16px" }}>
                  <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "800", color, marginBottom: "6px" }}>{num}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED MENTORS ── */}
      <section style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ color: "#6366f1", fontWeight: "700", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Meet some mentors</p>
              <h2 style={{ fontSize: isMobile ? "24px" : "clamp(26px, 3vw, 38px)", fontWeight: "800", color: "#0f172a" }}>Real professionals, real guidance</h2>
            </div>
            <Link to="/mentors" style={{ color: "#6366f1", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
            {featuredMentors.map((mentor) => (
              <div key={mentor.id} style={{ border: "1px solid #f1f5f9", borderRadius: "20px", padding: "24px", background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `linear-gradient(135deg, ${mentor.color}cc, ${mentor.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "15px", flexShrink: 0 }}>{mentor.avatar}</div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{mentor.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{mentor.role} @ {mentor.company}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
                  {mentor.skills.map(s => (<span key={s} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>{s}</span>))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <StarRating rating={mentor.rating} reviews={mentor.reviews} />
                  <span style={{ fontSize: "14px", fontWeight: "700", color: mentor.color }}>${mentor.price}/session</span>
                </div>
                <Link to="/register" style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: "10px", border: `2px solid ${mentor.color}`, color: mentor.color, fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>Book a session</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "#0f172a" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ color: "#6366f1", fontWeight: "700", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Success stories</p>
            <h2 style={{ fontSize: isMobile ? "26px" : "clamp(28px, 4vw, 42px)", fontWeight: "800", color: "white" }}>Real people, real results</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
                <div style={{ fontSize: "36px", color: t.color, marginBottom: "10px", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
                <p style={{ color: "#cbd5e1", lineHeight: "1.7", fontSize: "14px", marginBottom: "20px" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "13px" }}>{t.initial}</div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>{t.name}</div>
                    <div style={{ color: "#64748b", fontSize: "12px" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? "60px 5%" : "100px 5%", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: isMobile ? "26px" : "clamp(28px, 4vw, 48px)", fontWeight: "800", color: "white", marginBottom: "16px" }}>Ready to find your guide?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: isMobile ? "15px" : "18px", marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px" }}>Join thousands of students and graduates who've found clarity through MentorPath.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ background: "white", color: "#6366f1", textDecoration: "none", fontWeight: "800", fontSize: isMobile ? "15px" : "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "inline-block" }}>Get started free →</Link>
            <Link to="/mentors" style={{ background: "rgba(255,255,255,0.15)", color: "white", textDecoration: "none", fontWeight: "700", fontSize: isMobile ? "15px" : "16px", padding: "14px 28px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.3)", display: "inline-block" }}>Explore mentors</Link>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "20px" }}>Free plan available · No credit card required</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a0f1e", padding: isMobile ? "48px 5% 28px" : "60px 5% 32px", color: "#94a3b8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "32px" : "48px", marginBottom: "40px" }}>
            <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>M</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "white" }}>MentorPath</span>
              </Link>
              <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#64748b", maxWidth: "260px" }}>Connecting students and graduates with verified mentors who guide them to the career they want.</p>
            </div>
            {[
              ["Platform", ["Explore mentors", "How it works", "Career quiz"]],
              ["For mentors", ["Become a mentor", "Apply now"]],
              ["Company", ["Privacy policy", "Terms of service"]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <div style={{ color: "white", fontWeight: "700", fontSize: "13px", marginBottom: "14px" }}>{heading}</div>
                {links.map(l => (<div key={l} style={{ marginBottom: "10px" }}><a href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: "13px" }}>{l}</a></div>))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <p style={{ fontSize: "12px", color: "#475569" }}>© 2024 MentorPath. All rights reserved.</p>
            <p style={{ fontSize: "12px", color: "#475569" }}>Built for African talent 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
