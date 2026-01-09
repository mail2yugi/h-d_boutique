import express from 'express';
import { Favorite } from '../models/Favorite.model';
import { Activity } from '../models/Activity.model';
import { Product } from '../models/Product.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get user's favorites
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const favorites = await Favorite.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    
    const productIds = favorites.map(f => f.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productsWithUrls = products.map(product => ({
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    }));

    res.json({ success: true, data: productsWithUrls });
  } catch (error: any) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle favorite
router.post('/:productId/toggle', authenticate, async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await Favorite.findOne({ userId, productId });

    if (existing) {
      // Remove favorite
      await existing.deleteOne();
      res.json({ success: true, data: { favorited: false } });
    } else {
      // Add favorite
      await Favorite.create({ userId, productId });
      
      // Record activity
      await Activity.create({
        userId,
        productId,
        type: 'FAVORITE_PRODUCT',
      });

      res.json({ success: true, data: { favorited: true } });
    }
  } catch (error: any) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if product is favorited
router.get('/:productId/check', authenticate, async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;

    const favorite = await Favorite.findOne({ userId, productId });

    res.json({ success: true, data: { favorited: !!favorite } });
  } catch (error: any) {
    console.error('Check favorite error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
