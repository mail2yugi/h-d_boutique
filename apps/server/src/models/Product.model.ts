import mongoose, { Schema, Document } from 'mongoose';
import type { Product as IProduct } from '@hd-boutique/types';

export interface ProductDocument extends Omit<IProduct, '_id'>, Document {}

const ProductSchema = new Schema<ProductDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageIds: [{
      type: String,
      required: true,
    }],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      enum: ['BLOUSE', 'SAREE_DESIGNER_WORK', 'LEHANGA', 'BRIDAL_CUSTOMIZATION', 'CUSTOM_STITCHING'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ title: 'text', description: 'text' });

export const Product = mongoose.model<ProductDocument>('Product', ProductSchema);
