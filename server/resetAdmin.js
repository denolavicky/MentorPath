import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);

// Delete existing admin if any
await User.deleteOne({ email: "admin@mentorpath.com" });

// Create fresh
const admin = await User.create({
  name: "Admin",
  email: "admin@mentorpath.com",
  password: "admin1234",
  role: "admin",
});

console.log("✅ Admin created:", admin.email);
await mongoose.disconnect();