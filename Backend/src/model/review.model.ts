import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  product: { type: Schema.Types.ObjectId, ref: "Product" }
},{ timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);
