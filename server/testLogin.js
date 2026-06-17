import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne({ email: "admin@mentorpath.com" });
console.log("User found:", user ? "yes" : "no");

if (user) {
  const isMatch = await user.matchPassword("admin1234");
  console.log("Password match:", isMatch);
  console.log("Role:", user.role);
}

await mongoose.disconnect();