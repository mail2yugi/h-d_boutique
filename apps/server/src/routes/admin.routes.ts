import express from 'express';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { User } from '../models/User.model';
import { Product } from '../models/Product.model';
import { Activity } from '../models/Activity.model';
import { Favorite } from '../models/Favorite.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes require admin authentication
router.use(authenticate, requireAdmin);

// Get admin stats and dashboard data
router.get('/dashboard', async (req: any, res: any) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalFavorites = await Favorite.countDocuments();

    // Top favorited products
    const topFavorited = await Favorite.aggregate([
      {
        $group: {
          _id: '$productId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const productIds = topFavorited.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const topFavoritedProducts = topFavorited.map(item => {
      const product = products.find(p => p._id.toString() === item._id);
      return {
        product: product ? {
          ...product.toObject(),
          imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
        } : null,
        favoriteCount: item.count,
      };
    }).filter(item => item.product !== null);

    // Recent activities with user and product details
    const recentActivities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const userIds = [...new Set(recentActivities.map(a => a.userId))];
    const activityProductIds = [...new Set(recentActivities.map(a => a.productId))];

    const users = await User.find({ _id: { $in: userIds } });
    const activityProducts = await Product.find({ _id: { $in: activityProductIds } });

    const activitiesWithDetails = recentActivities.map(activity => ({
      ...activity.toObject(),
      user: users.find(u => u._id.toString() === activity.userId),
      product: activityProducts.find(p => p._id.toString() === activity.productId),
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalActivities,
        totalFavorites,
        topFavoritedProducts,
        recentActivities: activitiesWithDetails,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', async (req: any, res: any) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all activities
router.get('/activities', async (req: any, res: any) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments();

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== PRODUCT MANAGEMENT ROUTES =====

// GET all products with filters (admin view)
router.get('/products', async (req: any, res: any) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    // Add image URLs
    const productsWithUrls = products.map(product => ({
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    }));
    
    res.json({
      success: true,
      data: productsWithUrls,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new product with images
router.post('/products', upload.array('images', 5), async (req: any, res: any) => {
  try {
    const { title, description, price, category, discountPercent } = req.body;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }
    
    // Upload images to GridFS
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database connection not available' });
    }
    
    const bucket = db.collection('images.files') ? 
      new (require('mongodb').GridFSBucket)(db, { bucketName: 'images' }) : null;
    
    if (!bucket) {
      return res.status(500).json({ success: false, message: 'GridFS not available' });
    }
    
    const imageIds: string[] = [];
    
    for (const file of files) {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });
      
      const readableStream = Readable.from(file.buffer);
      await new Promise((resolve, reject) => {
        readableStream
          .pipe(uploadStream)
          .on('finish', () => {
            imageIds.push(uploadStream.id.toString());
            resolve(null);
          })
          .on('error', reject);
      });
    }
    
    // Create product
    const product = new Product({
      title,
      description,
      imageIds,
      price: parseFloat(price),
      discountPercent: parseFloat(discountPercent) || 0,
      category,
      status: 'available',
      createdBy: req.user!.email,
    });
    
    await product.save();
    
    // Add image URLs to response
    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };
    
    res.status(201).json({ success: true, data: productWithUrls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH mark product as sold/available
router.patch('/products/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['available', 'sold'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Add image URLs to response
    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };
    
    res.json({ success: true, data: productWithUrls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update product discount
router.patch('/products/:id/discount', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { discountPercent } = req.body;
    
    const discount = parseFloat(discountPercent);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' });
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { discountPercent: discount },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Add image URLs to response
    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };
    
    res.json({ success: true, data: productWithUrls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update product details
router.patch('/products/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, description, price, category } = req.body;
    
    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (price) updates.price = parseFloat(price);
    if (category) updates.category = category;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product
router.delete('/products/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Delete images from GridFS
    const db = mongoose.connection.db;
    if (db) {
      try {
        const MongoDB = require('mongodb');
        const bucket = new MongoDB.GridFSBucket(db, { bucketName: 'images' });
        for (const imageId of product.imageIds) {
          try {
            await bucket.delete(new MongoDB.ObjectId(imageId));
          } catch (err) {
            console.error(`Failed to delete image ${imageId}:`, err);
          }
        }
      } catch (err) {
        console.error('GridFS cleanup error:', err);
      }
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
