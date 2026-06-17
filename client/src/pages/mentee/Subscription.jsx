import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice.js";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    color: "#64748b",
    description: "Perfect for getting started",
    features: [
      { text: "3 sessions per month", included: true },
      { text: "Browse all mentors", included: true },
      { text: "Access career roadmaps", included: true },
      { text: "1-on-1 messaging", included: true },
      { text: "Career quiz", included: true },
      { text: "Unlimited sessions", included: false },
      { text: "Priority mentor matching", included: false },
      { text: "Session recordings", included: false },
      { text: "Exclusive workshops", included: false },
    ],
  },
  {
    name: "Pro",
    price: 15,
    period: "per month",
    color: "#6366f1",
    description: "For serious career growth",
    badge: "Most popular",
    features: [
      { text: "Unlimited sessions per month", included: true },
      { text: "Browse all mentors", included: true },
      { text: "Access career roadmaps", included: true },
      { text: "1-on-1 messaging", included: true },
      { text: "Career quiz", included: true },
      { text: "Unlimited sessions", included: true },
      { text: "Priority mentor matching", included: true },
      { text: "Session recordings", included: true },
      { text: "Exclusive workshops", included: true },
    ],
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your Pro subscription at any time. You'll keep access until the end of your billing period." },
  { q: "What happens to my sessions if I downgrade?", a: "You'll still have access to sessions you've already booked. Future bookings will be limited to 3 per month on the free plan." },
  { q: "Is my payment secure?", a: "Yes. All payments are processed securely through Stripe. We never store your card details." },
  { q: "Can I get a refund?", a: "We offer a 7-day money-back guarantee if you're not satisfied with Pro." },
];

function SubscriptionContent() {
  const user = useSelector(selectUser);
  const isPro = user?.subscriptionStatus === "pro";
  const sessionsUsed = user?.sessionsUsedThisMonth || 1;
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
          {isPro ? "You're on Pro 🎉" : "Upgrade your mentorship"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          {isPro ? "You have unlimited access to all mentors and sessions." : "Get unlimited sessions and priority access to the best mentors."}
        </p>
      </div>

      {/* Current usage (free users) */}
      {!isPro && (
        <div style={{ background: "white", borderRadius: "16px", padding: "20px 24px", border: "1px solid #f1f5f9", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>Your free sessions this month</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: "32px", height: "32px", borderRadius: "8px", background: i <= sessionsUsed ? "#6366f1" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "14px" }}>{i <= sessionsUsed ? "✓" : ""}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>{sessionsUsed}/3 sessions used · Resets on the 1st</p>
          </div>
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "12px", padding: "12px 16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e" }}>
              {3 - sessionsUsed === 0 ? "You've used all your free sessions!" : `${3 - sessionsUsed} session${3 - sessionsUsed !== 1 ? "s" : ""} remaining`}
            </p>
            <p style={{ fontSize: "12px", color: "#b45309", marginTop: "2px" }}>Upgrade to Pro for unlimited access</p>
          </div>
        </div>
      )}

      {/* Billing toggle */}
      {!isPro && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", background: "white", borderRadius: "12px", padding: "4px", border: "1px solid #f1f5f9", gap: "4px" }}>
            {["monthly", "yearly"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px", background: billing === b ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent", color: billing === b ? "white" : "#64748b", transition: "all 0.2s", textTransform: "capitalize" }}>
                {b} {b === "yearly" && <span style={{ fontSize: "10px", background: "#10b981", color: "white", padding: "1px 5px", borderRadius: "4px", marginLeft: "4px" }}>Save 20%</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Plans */}
      {!isPro && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: "white", borderRadius: "20px", padding: "28px", border: plan.name === "Pro" ? "2px solid #6366f1" : "1px solid #f1f5f9", position: "relative", boxShadow: plan.name === "Pro" ? "0 8px 24px rgba(99,102,241,0.15)" : "none" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "11px", fontWeight: "800", padding: "4px 14px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{plan.name}</h2>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>{plan.description}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "36px", fontWeight: "800", color: plan.color }}>
                    {plan.price === 0 ? "Free" : `$${billing === "yearly" ? Math.round(plan.price * 0.8) : plan.price}`}
                  </span>
                  {plan.price > 0 && <span style={{ fontSize: "14px", color: "#94a3b8" }}>/{billing === "yearly" ? "mo, billed yearly" : "month"}</span>}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: feature.included ? (plan.name === "Pro" ? "#6366f1" : "#10b981") : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", color: feature.included ? "white" : "#cbd5e1", fontWeight: "800" }}>{feature.included ? "✓" : "✕"}</span>
                    </div>
                    <span style={{ fontSize: "13px", color: feature.included ? "#374151" : "#94a3b8", fontWeight: feature.included ? "500" : "400" }}>{feature.text}</span>
                  </div>
                ))}
              </div>

              {plan.name === "Free" ? (
                <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9", textAlign: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#94a3b8" }}>Current plan</span>
                </div>
              ) : (
                <button style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", padding: "13px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
                  Upgrade to Pro →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pro active state */}
      {isPro && (
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: "20px", padding: "32px", marginBottom: "32px", border: "1px solid rgba(99,102,241,0.3)", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚀</div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "white", marginBottom: "8px" }}>You're on Pro!</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>Unlimited sessions, priority matching, and full access to everything MentorPath has to offer.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/explore" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "14px" }}>
              Find a mentor →
            </Link>
            <button style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Cancel subscription
            </button>
          </div>
        </div>
      )}

      {/* Social proof */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>What Pro members say</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { name: "Emeka N.", text: "Upgrading to Pro was the best decision. I booked 8 sessions in my first month and landed a job offer within 3 months.", avatar: "EN", color: "#6366f1" },
            { name: "Fatima B.", text: "The unlimited sessions meant I could practice mock interviews as many times as I needed. Worth every penny.", avatar: "FB", color: "#10b981" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "14px", background: "#fafafa", borderRadius: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${t.color}cc, ${t.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "12px", flexShrink: 0 }}>{t.avatar}</div>
              <div>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6", marginBottom: "4px" }}>{t.text}</p>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>Frequently asked questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #f8fafc" : "none" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{faq.q}</span>
                <span style={{ fontSize: "18px", color: "#94a3b8", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7", paddingBottom: "14px" }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Subscription() {
  return (
    <MenteeLayout>
      <SubscriptionContent />
    </MenteeLayout>
  );
}
