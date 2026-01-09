import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import favoriteRoutes from './routes/favorite.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import imageRoutes from './routes/image.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Rate limiting (free, in-memory)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development to allow image loading
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
}));
app.use(cors({
  origin: [
    process.env.WEB_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174', // Alternative port when 5173 is in use
    'http://localhost:8083', // Mobile app port
    'https://mail2yugi.github.io', // GitHub Pages
    process.env.MOBILE_URL || 'exp://localhost:19000',
    'http://localhost:19000',
    'http://localhost:19001',
    'http://localhost:19002',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/images', imageRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

export default app;
