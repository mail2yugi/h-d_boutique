# H & D Boutique - Production E-Commerce Platform

A **fully free** production-ready monorepo e-commerce application for H & D Boutique.

## 🎯 100% Free Stack

- ✅ **Frontend**: GitHub Pages (free static hosting)
- ✅ **Backend**: Vercel Serverless Functions (free tier, no credit card)
- ✅ **Database**: MongoDB Atlas Free Cluster (512MB shared)
- ✅ **Storage**: MongoDB GridFS (no Cloudinary, no paid storage)
- ✅ **Auth**: Google OAuth (free)
- ✅ **Mobile**: Expo Go (free distribution)

**No paid services. No credit cards. No hidden costs.**

---

## 🏗️ Monorepo Structure

```
hd-boutique/
├── apps/
│   ├── web/          # React + Vite + TypeScript (GitHub Pages)
│   ├── mobile/       # React Native + Expo
│   └── server/       # Node.js + Express + TypeScript (Vercel Serverless)
├── packages/
│   ├── ui/           # Shared components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs (ESLint, Prettier, Tailwind)
└── pnpm-workspace.yaml
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- MongoDB Atlas free account
- Google OAuth credentials
- GitHub account (for Pages deployment)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **free Shared Cluster** (M0, 512MB)
3. Create database user and get connection string
4. Whitelist IP: `0.0.0.0/0` (allow all for Vercel)

### 3. Set Up Google OAuth (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5001/auth/google/callback` (dev)
   - `https://your-vercel-app.vercel.app/auth/google/callback` (prod)
   - `https://your-github-username.github.io/hd/auth/google/callback` (web)

### 4. Configure Environment Variables

#### Backend (`apps/server/.env`)

```env
NODE_ENV=development
PORT=5001

# MongoDB Atlas Free Cluster
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hd-boutique?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback

# URLs
WEB_URL=http://localhost:5173
MOBILE_URL=exp://localhost:19000
SERVER_URL=http://localhost:5001

# Admin Email
ADMIN_EMAIL=xyzmail@gmail.com
```

#### Web (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Mobile (`apps/mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:5001
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 5. Development

Start all apps in parallel:

```bash
# Terminal 1: Backend
pnpm --filter server dev

# Terminal 2: Web
pnpm --filter web dev

# Terminal 3: Mobile
pnpm --filter mobile start
```

Or start all at once:

```bash
pnpm dev
```

### 6. Seed Database

```bash
pnpm --filter server seed
```

This creates:
- Admin user (`xyzmail@gmail.com`)
- Sample products with GridFS images

---

## 🌐 Deployment (All Free)

### Deploy Backend to Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy:

```bash
cd apps/server
vercel --prod
```

4. Add environment variables in Vercel dashboard
5. Update `SERVER_URL` in web/mobile `.env` files

**Cost: $0/month** (Vercel Free: 100GB bandwidth, serverless functions)

### Deploy Web to GitHub Pages (Free)

1. Push code to GitHub
2. Enable GitHub Pages in repo settings
3. GitHub Actions will auto-deploy on push to `main`

```bash
git add .
git commit -m "Deploy H & D Boutique"
git push origin main
```

**Cost: $0/month** (GitHub Pages: free for public repos)

### Deploy Mobile via Expo Go (Free)

1. Create Expo account (free)
2. Publish:

```bash
cd apps/mobile
npx expo publish
```

3. Share Expo Go link with users (no App Store fees)

**Cost: $0/month** (Expo Go distribution is free)

---

## 📱 Features

### Public Features (No Login Required)

- Browse all products with filters (category, search)
- View product details with image carousel
- See prices with discount badges
- Contact via WhatsApp for purchases
- Responsive design (mobile-first)

### User Features (Google Sign-In)

- Save favorite products
- View favorites list
- Track activity (views, favorites)
- Account dashboard

### Admin Features (`xyzmail@gmail.com`)

- Upload products with multiple images (GridFS)
- Edit product details
- Mark products as "Sold"
- Publish/unpublish products
- View user activity dashboard
- Top favorited products analytics

---

## 🎨 Branding

**H & D Boutique** - Inspired by YouTube channel `@h_and_d_boutique`

### Color Palette

- Primary: `#A83279` (Deep Magenta)
- Accent: `#D4AF37` (Gold)
- Background: `#FFF8F0` (Ivory)
- Muted: `#F5E6EA` (Soft Pink)
- Text: `#2B2B2B` (Charcoal)

### Typography

- Headings: **Playfair Display** (Google Fonts, free)
- Body: **Inter** (Google Fonts, free)

### Logo

SVG and PNG wordmarks available in `apps/web/public/branding/`

---

## 📦 Product Categories

1. **Blouse** - Custom-tailored blouses
2. **Saree Designer Work** - Designer saree collections
3. **Lehenga** - Traditional and modern lehengas
4. **Bridal Customization** - Bespoke bridal wear
5. **Custom Stitching** - Personalized tailoring services

---

## 💬 Contact

- **WhatsApp**: [+91 99166 32308](https://wa.me/919916632308)
- **Location**: [H&D Boutique on Google Maps](https://www.google.de/maps/place/H%26D+Boutique/@12.8950787,77.6121472,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15eab9be867d:0x430af845237e7feb!8m2!3d12.8950735!4d77.6147221!16s%2Fg%2F11yfsm90r3?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D)

---

## 🧪 Acceptance Tests

✅ Public browsing without login  
✅ Brand theme (colors, fonts, logo) loads  
✅ Google sign-in works  
✅ Only admin can access `/admin`  
✅ Admin can upload products and mark sold  
✅ Sold items show "Sold" badge  
✅ "Checkout (Coming Soon)" disabled  
✅ Favorites persist across sessions  
✅ WhatsApp buttons open with product ID  
✅ Mobile app syncs with backend  
✅ **No paid services used**

---

## 🛠️ Tech Stack Details

### Frontend (Web)

- React 18
- TypeScript 5
- Vite 5
- React Router 6
- Tailwind CSS 3
- Axios
- React Hook Form
- Zustand (state management)

### Mobile

- React Native
- Expo SDK 50
- TypeScript
- React Navigation
- Expo AuthSession

### Backend

- Node.js 18+
- Express 4
- TypeScript 5
- Mongoose (MongoDB ODM)
- GridFS (image storage)
- JWT authentication
- Express Rate Limit
- Helmet (security)

---

## 🔒 Security

- HTTP-only cookies for web auth
- Secure token storage for mobile
- JWT with expiration
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS configured
- Admin role-based access control

---

## 📈 Scalability (Within Free Limits)

### MongoDB Atlas Free

- 512MB storage
- Shared CPU
- Good for ~10K products with images

### Vercel Free

- 100GB bandwidth/month
- 100 serverless function invocations/day
- Good for moderate traffic

### GitHub Pages Free

- 100GB bandwidth/month
- Good for static assets

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Ensure IP whitelist includes 0.0.0.0/0
# Check connection string format
# Verify database user credentials
```

### Vercel Deployment Fails

```bash
# Ensure all env vars are set in Vercel dashboard
# Check build logs for missing dependencies
# Verify Node.js version matches .nvmrc
```

### GitHub Pages 404

```bash
# Ensure base path in vite.config.ts matches repo name
# Check GitHub Actions workflow completed
# Verify gh-pages branch exists
```

### Images Not Loading

```bash
# GridFS stores images in MongoDB
# Ensure /images/:fileId endpoint works
# Check MongoDB connection
```

---

## 🎯 Future Enhancements

- [ ] Full checkout flow with payment integration
- [ ] Email notifications (free service like SendGrid free tier)
- [ ] Advanced analytics dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist sharing
- [ ] Multi-language support

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🙏 Credits

Built with ❤️ for **H & D Boutique**

**Fully free stack. No hidden costs. Production-ready.**

For support, contact via WhatsApp: +91 99166 32308
