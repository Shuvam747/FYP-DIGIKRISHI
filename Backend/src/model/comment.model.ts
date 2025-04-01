import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
