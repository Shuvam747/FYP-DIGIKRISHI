import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  },
  { timestamps: true }
);

export const Bookmark = mongoose.model('Bookmark', commentSchema);
