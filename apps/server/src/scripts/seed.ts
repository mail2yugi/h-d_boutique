import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Product } from '../models/Product.model';
import { uploadToGridFS } from '../utils/gridfs.util';
import { initGridFS } from '../utils/gridfs.util';

dotenv.config();

// Sample image data (base64 encoded 1x1 pixel images for demo)
const createSampleImage = async (color: string, filename: string): Promise<string> => {
  // Create a simple colored square as a placeholder
  const canvas = Buffer.from(
    `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color}"/>
      <text x="200" y="200" font-size="20" text-anchor="middle" fill="white">
        ${filename}
      </text>
    </svg>`
  );
  
  return uploadToGridFS(canvas, filename, 'image/svg+xml');
};

const seed = async () => {
  try {
    console.log('🌱 Starting seed process...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Initialize GridFS
    initGridFS();
    console.log('✅ GridFS initialized');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'H & D Boutique Admin',
      email: process.env.ADMIN_EMAIL || 'xyzmail@gmail.com',
      image: 'https://ui-avatars.com/api/?name=Admin&background=A83279&color=fff',
      role: 'admin',
      provider: 'google',
    });

    console.log('✅ Created admin user:', admin.email);

    // Create sample products
    const categories = ['BLOUSE', 'SAREE_DESIGNER_WORK', 'LEHANGA', 'BRIDAL_CUSTOMIZATION', 'CUSTOM_STITCHING'] as const;
    const colors = ['#A83279', '#D4AF37', '#FF6B9D', '#8B4789', '#C19A6B'];

    const products = [];

    for (let i = 0; i < 20; i++) {
      const category = categories[i % categories.length];
      const imageIds = [];

      // Create 2-3 sample images per product
      for (let j = 0; j < 2 + (i % 2); j++) {
        const imageId = await createSampleImage(
          colors[j % colors.length],
          `${category}_${i + 1}_img${j + 1}.svg`
        );
        imageIds.push(imageId);
      }

      const product = await Product.create({
        title: `${category.replace(/_/g, ' ')} Product ${i + 1}`,
        description: `Beautiful ${category.toLowerCase().replace(/_/g, ' ')} with exquisite craftsmanship. Perfect for special occasions. Custom tailored to perfection with premium fabrics and intricate detailing.`,
        imageIds,
        price: Math.floor(Math.random() * 10000) + 5000,
        discountPercent: [0, 0, 10, 15, 20][i % 5],
        category,
        status: i % 7 === 0 ? 'sold' : 'available',
        createdBy: admin._id.toString(),
      });

      products.push(product);
    }

    console.log(`✅ Created ${products.length} sample products`);

    console.log('\n✨ Seed completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Admin: ${admin.email}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Images: ${products.reduce((sum, p) => sum + p.imageIds.length, 0)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
