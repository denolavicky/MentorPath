import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: "" },
    tags: [String],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
