import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    role: { type: String, enum: ["mentee", "mentor", "admin"], default: "mentee" },
    avatar: { type: String, default: "" },

    // ── Mentee onboarding ──
    bio: { type: String, default: "" },
    careerField: { type: String, default: "" },
    careerGoal: { type: String, default: "" },
    situation: { type: String, default: "" },
    challenges: [String],
    helpNeeded: [String],
    timeline: { type: String, default: "" },
    onboardingComplete: { type: Boolean, default: false },
    goals: [String],

    // ── Mentor-specific ──
    mentorStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
    expertise: [String],
    skills: [String],
    experience: { type: String, default: "" },
    sessionPrice: { type: Number, default: 0 },
    linkedIn: { type: String, default: "" },
    website: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    applicationData: { type: mongoose.Schema.Types.Mixed, default: {} },

    // ── Auth ──
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    // ── Saved mentors (mentee) ──
    savedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ── Stripe ──
    stripeCustomerId: { type: String },
    stripeAccountId: { type: String },
    subscriptionStatus: { type: String, enum: ["free", "pro"], default: "free" },
    sessionsUsedThisMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
