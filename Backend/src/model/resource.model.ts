import mongoose from 'mongoose';
import { RESOURCE_TYPE } from '../typings/base.type';

const resourceSchema = new mongoose.Schema({
    title:           { type: String, required: true },
    description:     { type: String },
    category:        { type: String, required: true },
    resourceType:    { type: String, enum: Object.values(RESOURCE_TYPE), required: true },
    url:             { type: String},
    uploadedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    photo:           [{ type: String }],
    file:            [{ type: String }],
    isExpertVerified:{ type: Boolean, default: false },
    language:        { type: String, default: 'en' },
    votes:           { type: Number, default: 0 },
    comment:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  }, { timestamps: true });
  
export const Resource = mongoose.model('Resource', resourceSchema);