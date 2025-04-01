import mongoose from "mongoose";
import { REQUEST_STATUS, ROLE } from "../typings/base.type";

const requestSchema = new mongoose.Schema(
  {
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    role: { type: String, enum: Object.values(ROLE), required: true },
    verifyStatus: { type: String,enum:Object.values(REQUEST_STATUS), default: REQUEST_STATUS.PENDING },
    govtDocument: { type: String ,required:true},
  },
  { timestamps: true }
);

export const VerifyRequest = mongoose.model("VerifyRequest", requestSchema);
