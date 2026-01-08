import mongoose, { Schema, Document } from 'mongoose';
import type { Favorite as IFavorite } from '@hd-boutique/types';

export interface FavoriteDocument extends Omit<IFavorite, '_id'>, Document {}

const FavoriteSchema = new Schema<FavoriteDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound unique index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Favorite = mongoose.model<FavoriteDocument>('Favorite', FavoriteSchema);
