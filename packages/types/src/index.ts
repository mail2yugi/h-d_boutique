// User types
export type UserRole = 'user' | 'admin';
export type AuthProvider = 'google' | 'email';

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalFavorites: number;
  totalActivities: number;
}

// Product types
export type ProductCategory = 
  | 'BLOUSE'
  | 'SAREE_DESIGNER_WORK'
  | 'LEHANGA'
  | 'BRIDAL_CUSTOMIZATION'
  | 'CUSTOM_STITCHING';

export type ProductStatus = 'available' | 'sold';

export interface Product {
  _id: string;
  title: string;
  description: string;
  imageIds: string[];
  price: number;
  discountPercent: number;
  category: ProductCategory;
  status: ProductStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithImages extends Product {
  imageUrls: string[];
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  category: ProductCategory;
  images: any[]; // File[] in browser, will be handled by form
}

// Favorite types
export interface Favorite {
  _id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

// Activity types
export type ActivityType = 'VIEW_PRODUCT' | 'FAVORITE_PRODUCT';

export interface Activity {
  _id: string;
  userId: string;
  productId: string;
  type: ActivityType;
  createdAt: Date;
}

export interface ActivityWithDetails extends Activity {
  user?: User;
  product?: Product;
}

// Order types (future)
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface GoogleAuthPayload {
  code: string;
  redirectUri?: string;
}

// Filter types
export interface ProductFilters {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// Admin Dashboard types
export interface TopFavoritedProduct {
  product: Product;
  favoriteCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalActivities: number;
  totalFavorites: number;
  topFavoritedProducts: TopFavoritedProduct[];
  recentActivities: ActivityWithDetails[];
}

// Brand types
export interface BrandColors {
  primary: string;
  accent: string;
  background: string;
  muted: string;
  text: string;
}

export const brandColors: BrandColors = {
  primary: '#A83279',
  accent: '#D4AF37',
  background: '#FFF8F0',
  muted: '#F5E6EA',
  text: '#2B2B2B',
};

// Contact information
export const contactInfo = {
  whatsapp: '+919916632308',
  whatsappLink: 'https://wa.me/919916632308',
  mapLink: 'https://www.google.de/maps/place/H%26D+Boutique/@12.8950787,77.6121472,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15eab9be867d:0x430af845237e7feb!8m2!3d12.8950735!4d77.6147221!16s%2Fg%2F11yfsm90r3?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
};

// Category labels
export const categoryLabels: Record<ProductCategory, string> = {
  BLOUSE: 'Blouse',
  SAREE_DESIGNER_WORK: 'Saree Designer Work',
  LEHANGA: 'Lehenga',
  BRIDAL_CUSTOMIZATION: 'Bridal Customization',
  CUSTOM_STITCHING: 'Custom Stitching',
};

// Category descriptions
export const categoryDescriptions: Record<ProductCategory, string> = {
  BLOUSE: 'Exquisite custom-tailored blouses crafted with precision and elegance. Each piece reflects timeless style and perfect fit.',
  SAREE_DESIGNER_WORK: 'Designer saree collections featuring intricate embroidery, stunning embellishments, and contemporary designs that celebrate tradition.',
  LEHANGA: 'Traditional and modern lehengas that blend heritage craftsmanship with contemporary aesthetics. Perfect for every celebration.',
  BRIDAL_CUSTOMIZATION: 'Bespoke bridal wear tailored to your dreams. From concept to creation, we craft your perfect wedding ensemble.',
  CUSTOM_STITCHING: 'Personalized tailoring services with meticulous attention to detail. Your vision, our expertise, perfect execution.',
};
