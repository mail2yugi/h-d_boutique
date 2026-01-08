import mongoose, { Schema, Document } from 'mongoose';
import type { Activity as IActivity } from '@hd-boutique/types';

export interface ActivityDocument extends Omit<IActivity, '_id'>, Document {}

const ActivitySchema = new Schema<ActivityDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['VIEW_PRODUCT', 'FAVORITE_PRODUCT'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for efficient queries
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ productId: 1 });
ActivitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model<ActivityDocument>('Activity', ActivitySchema);
