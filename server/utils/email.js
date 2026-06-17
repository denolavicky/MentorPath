import nodemailer from "nodemailer";

// ── Create transporter ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Base email style ──
const baseTemplate = (content) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
    <div style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 28px 32px; text-align: center;">
        <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <span style="color: white; font-size: 20px; font-weight: 800;">M</span>
        </div>
        <h1 style="color: white; font-size: 20px; font-weight: 800; margin: 0;">MentorPath</h1>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} MentorPath · You're receiving this because you have an account on MentorPath.
        </p>
      </div>
    </div>
  </div>
`;

// ── Send booking confirmation to mentee ──
export const sendBookingConfirmation = async ({ mentee, mentor, session }) => {
  const html = baseTemplate(`
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">Session confirmed! 🎉</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Your session has been booked successfully.</p>

    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #6366f1cc, #6366f166); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px;">
          ${mentor.name.charAt(0)}
        </div>
        <div>
          <div style="font-weight: 700; font-size: 15px; color: #0f172a;">${mentor.name}</div>
          <div style="font-size: 13px; color: #64748b;">${mentor.careerField || "Mentor"}</div>
        </div>
      </div>
      ${[
        ["📅 Date", new Date(session.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
        ["🕐 Time", session.time],
        ["⏱️ Duration", "60 minutes"],
        ["📋 Topic", session.topic],
        ["💰 Price", `$${session.price}`],
      ].map(([label, value]) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 13px; color: #94a3b8;">${label}</span>
          <span style="font-size: 13px; color: #0f172a; font-weight: 600;">${value}</span>
        </div>
      `).join("")}
    </div>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="font-size: 13px; color: #166534; font-weight: 600; margin: 0 0 4px;">📧 What happens next?</p>
      <p style="font-size: 13px; color: #166534; margin: 0;">Your mentor will be in touch with the session link. You can also view and manage your sessions from your dashboard.</p>
    </div>

    <a href="${process.env.CLIENT_URL}/my-sessions" style="display: block; text-align: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px;">
      View my sessions →
    </a>
  `);

  await transporter.sendMail({
    from: `"MentorPath" <${process.env.EMAIL_USER}>`,
    to: mentee.email,
    subject: `Session confirmed with ${mentor.name} 🎉`,
    html,
  });
};

// ── Send booking notification to mentor ──
export const sendMentorBookingAlert = async ({ mentee, mentor, session }) => {
  const html = baseTemplate(`
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">New session booked! 📅</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;"><strong>${mentee.name}</strong> has booked a session with you.</p>

    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
      ${[
        ["👤 Mentee", mentee.name],
        ["📅 Date", new Date(session.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
        ["🕐 Time", session.time],
        ["📋 Topic", session.topic],
        ["💰 You earn", `$${Math.round(session.price * 0.8)} (after 20% platform fee)`],
      ].map(([label, value]) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 13px; color: #94a3b8;">${label}</span>
          <span style="font-size: 13px; color: #0f172a; font-weight: 600;">${value}</span>
        </div>
      `).join("")}
    </div>

    <a href="${process.env.CLIENT_URL}/mentor/sessions" style="display: block; text-align: center; background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px;">
      View my sessions →
    </a>
  `);

  await transporter.sendMail({
    from: `"MentorPath" <${process.env.EMAIL_USER}>`,
    to: mentor.email,
    subject: `New session booked by ${mentee.name} 📅`,
    html,
  });
};

// ── Send mentor approval email ──
export const sendMentorApprovalEmail = async ({ user, approved }) => {
  const html = approved
    ? baseTemplate(`
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">You're approved! 🎉</h2>
        <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">
          Congratulations <strong>${user.name}</strong>! Your mentor application has been approved. You can now start receiving session bookings.
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="font-size: 13px; color: #166534; font-weight: 600; margin: 0 0 8px;">✅ What's next?</p>
          <ul style="font-size: 13px; color: #166534; margin: 0; padding-left: 16px; line-height: 1.8;">
            <li>Set your availability so mentees can book sessions</li>
            <li>Complete your profile with a bio and skills</li>
            <li>Set your session price</li>
            <li>Create a roadmap to attract mentees</li>
          </ul>
        </div>
        <a href="${process.env.CLIENT_URL}/mentor/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #10b981, #34d399); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px;">
          Go to my dashboard →
        </a>
      `)
    : baseTemplate(`
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">Application update</h2>
        <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">
          Hi <strong>${user.name}</strong>, after careful review your mentor application was not approved at this time.
        </p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="font-size: 13px; color: #dc2626; margin: 0;">You're welcome to reapply in the future with more experience or an updated profile. If you have questions, reply to this email.</p>
        </div>
        <a href="${process.env.CLIENT_URL}/explore" style="display: block; text-align: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px;">
          Explore MentorPath →
        </a>
      `);

  await transporter.sendMail({
    from: `"MentorPath" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: approved ? "Your mentor application was approved! 🎉" : "Update on your mentor application",
    html,
  });
};

// ── Send password reset email ──
export const sendPasswordResetEmail = async ({ user, resetToken }) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const html = baseTemplate(`
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">Reset your password 🔐</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">
      Hi <strong>${user.name}</strong>, we received a request to reset your password. Click the button below to set a new one.
    </p>

    <a href="${resetURL}" style="display: block; text-align: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px; margin-bottom: 20px;">
      Reset my password →
    </a>

    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
      <p style="font-size: 13px; color: #92400e; margin: 0;">⏰ This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
    </div>

    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
      Or copy this link: <br/>
      <span style="color: #6366f1; word-break: break-all;">${resetURL}</span>
    </p>
  `);

  await transporter.sendMail({
    from: `"MentorPath" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Reset your MentorPath password 🔐",
    html,
  });
};
