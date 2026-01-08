import express from 'express';
import multer from 'multer';
import { Product } from '../models/Product.model';
import { Activity } from '../models/Activity.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { uploadToGridFS, deleteFromGridFS } from '../utils/gridfs.util';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status = 'available',
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

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
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single product (public)
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Record view activity if authenticated
    if (req.user) {
      await Activity.create({
        userId: req.user.id,
        productId: product._id.toString(),
        type: 'VIEW_PRODUCT',
      });
    }

    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };

    res.json({ success: true, data: productWithUrls });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    const { title, description, price, discountPercent, category } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image required' });
    }

    // Upload images to GridFS
    const imageIds: string[] = [];
    for (const file of files) {
      const fileId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype);
      imageIds.push(fileId);
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      discountPercent: Number(discountPercent) || 0,
      category,
      imageIds,
      createdBy: req.user!.id,
    });

    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };

    res.status(201).json({ success: true, data: productWithUrls });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { title, description, price, discountPercent, category, status, removeImageIds } = req.body;
    const files = req.files as Express.Multer.File[];

    // Remove specified images
    if (removeImageIds) {
      const idsToRemove = JSON.parse(removeImageIds);
      for (const id of idsToRemove) {
        await deleteFromGridFS(id);
        product.imageIds = product.imageIds.filter(imageId => imageId !== id);
      }
    }

    // Add new images
    if (files && files.length > 0) {
      for (const file of files) {
        const fileId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype);
        product.imageIds.push(fileId);
      }
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (discountPercent !== undefined) product.discountPercent = Number(discountPercent);
    if (category) product.category = category;
    if (status) product.status = status;

    await product.save();

    const productWithUrls = {
      ...product.toObject(),
      imageUrls: product.imageIds.map(id => `${process.env.SERVER_URL}/images/${id}`),
    };

    res.json({ success: true, data: productWithUrls });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark product as sold (admin only)
router.post('/:id/sold', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.status = 'sold';
    await product.save();

    res.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Mark sold error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from GridFS
    for (const imageId of product.imageIds) {
      await deleteFromGridFS(imageId);
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
