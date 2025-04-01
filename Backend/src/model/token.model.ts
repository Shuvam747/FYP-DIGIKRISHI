import mongoose from "mongoose";

export enum TokenType {
    EMAIL="email",
    PHONE="phone"
}
const tokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type:{type:String,enum:Object.values(TokenType),default:TokenType.EMAIL},
        trash: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true }
    },
    { timestamps: true }
)

export const Token = mongoose.model("Token", tokenSchema);

