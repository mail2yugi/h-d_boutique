import mongoose, { Schema, Document } from 'mongoose';
import type { Order as IOrder } from '@hd-boutique/types';

export interface OrderDocument extends Omit<IOrder, '_id'>, Document {}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [{
      productId: String,
      quantity: Number,
      price: Number,
    }],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
OrderSchema.index({ userId: 1, createdAt: -1 });

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);
