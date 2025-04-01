import mongoose from "mongoose";
import { ROLE } from "../typings/base.type";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLE), required: true },
    isVerified: { type: Boolean, default: false },
    numberVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    govtDocument: { type: String },
    profilePicture: { type: String },
    language: { type: String, default: "en" },
    description:{ type: String ,default:""},
    points: { type: Number, default: 0 },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
