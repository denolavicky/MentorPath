import dotenv from "dotenv";
dotenv.config();


import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value || "";

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // Update avatar from Google if not set
          if (!user.avatar && avatar) {
            user.avatar = avatar;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user from Google profile
        user = await User.create({
          name: profile.displayName,
          email,
          avatar,
          password: `google_${profile.id}_${Date.now()}`, // random password they'll never use
          role: "mentee", // default role, can be changed
          isEmailVerified: true, // Google emails are verified
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
