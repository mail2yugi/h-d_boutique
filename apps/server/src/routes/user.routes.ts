import express from 'express';
import { User } from '../models/User.model';
import { Favorite } from '../models/Favorite.model';
import { Activity } from '../models/Activity.model';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user stats
    const totalFavorites = await Favorite.countDocuments({ userId: user._id.toString() });
    const totalActivities = await Activity.countDocuments({ userId: user._id.toString() });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          provider: user.provider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        stats: {
          totalFavorites,
          totalActivities,
        },
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user activities
router.get('/activities', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const activities = await Activity.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments({ userId: req.user!.id });

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

export default router;
