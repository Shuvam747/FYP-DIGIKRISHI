import mongoose, { Schema } from "mongoose";
const productSchema = new mongoose.Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: String,
    isVerified: { type: Boolean, default: false },
    availableForDelivery: { type: Boolean, default: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
