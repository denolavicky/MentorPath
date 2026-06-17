import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Verify JWT token ──
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorised, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Not authorised, invalid token" });
  }
};

// ── Role guard: pass in one or more allowed roles ──
// Usage: authorise("admin")  or  authorise("mentor", "admin")
export const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
  }
  next();
};

// ── Mentor must be verified/approved ──
export const requireVerified = (req, res, next) => {
  if (req.user.role === "mentor" && req.user.mentorStatus !== "approved") {
    return res.status(403).json({ message: "Your mentor account is not yet approved" });
  }
  next();
};
