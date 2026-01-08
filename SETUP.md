# 🚀 H & D Boutique - Complete Setup Guide

This guide will help you set up the entire H & D Boutique e-commerce platform using **100% free services**.

## 📋 Prerequisites

- Node.js 18+ and pnpm 8+ installed
- Git installed
- GitHub account (free)
- Google account (free)

## 🏁 Quick Start (5 Steps)

### Step 1: Clone and Install

```bash
cd /Users/yugandhar.dhandusubramanyam/Public/hd
pnpm install
```

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **free account** (no credit card required)
3. Create a **free Shared Cluster** (M0 Sandbox - 512MB)
   - Cloud Provider: AWS / GCP / Azure (any)
   - Region: Choose nearest to you
4. Create Database User:
   - Username: `hdadmin`
   - Password: Generate a strong password
5. Network Access:
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
   - This is needed for Vercel deployment
6. Get Connection String:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `hd-boutique`

Example: `mongodb+srv://hdadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hd-boutique?retryWrites=true&w=majority`

### Step 3: Set Up Google OAuth (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "H & D Boutique"
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "H & D Boutique Web"
   - Authorized JavaScript origins:
     - `http://localhost:5001` (dev)
     - `http://localhost:5173` (dev web)
     - `https://YOUR-VERCEL-APP.vercel.app` (prod - add after Step 5)
     - `https://YOUR-GITHUB-USERNAME.github.io` (prod - add after Step 6)
   - Authorized redirect URIs:
     - `http://localhost:5001/auth/google/callback` (dev)
     - `https://YOUR-VERCEL-APP.vercel.app/auth/google/callback` (prod - add after Step 5)
5. Copy your Client ID and Client Secret

### Step 4: Configure Environment Variables

#### Backend (`apps/server/.env`)

```bash
cp apps/server/.env.example apps/server/.env
```

Edit `apps/server/.env`:

```env
NODE_ENV=development
PORT=5001

# Your MongoDB Atlas connection string from Step 2
MONGODB_URI=mongodb+srv://hdadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hd-boutique?retryWrites=true&w=majority

# Generate a random secret (or use this example)
JWT_SECRET=hd-boutique-super-secret-jwt-key-2024-change-this-in-production
JWT_EXPIRES_IN=7d

# Your Google OAuth credentials from Step 3
GOOGLE_CLIENT_ID=YOUR-CLIENT-ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR-CLIENT-SECRET
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback

# Development URLs
WEB_URL=http://localhost:5173
MOBILE_URL=exp://localhost:19000
SERVER_URL=http://localhost:5001

# Admin email (gets admin role automatically)
ADMIN_EMAIL=xyzmail@gmail.com
```

#### Web (`apps/web/.env`)

```bash
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env`:

```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=YOUR-CLIENT-ID.apps.googleusercontent.com
```

#### Mobile (`apps/mobile/.env`)

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5001
EXPO_PUBLIC_GOOGLE_CLIENT_ID=YOUR-CLIENT-ID.apps.googleusercontent.com
```

### Step 5: Seed Database

```bash
pnpm --filter server seed
```

This creates:
- Admin user: `xyzmail@gmail.com`
- 20 sample products with images in GridFS

### Step 6: Run Development Servers

Open 3 terminals:

**Terminal 1 - Backend:**
```bash
pnpm --filter server dev
```

**Terminal 2 - Web:**
```bash
pnpm --filter web dev
```

**Terminal 3 - Mobile:**
```bash
pnpm --filter mobile start
```

Access:
- Web: http://localhost:5173/hd
- API: http://localhost:5001/health
- Mobile: Scan QR code with Expo Go app

---

## 🌐 Production Deployment (100% Free)

### Deploy Backend to Vercel (Free)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from backend directory:
```bash
cd apps/server
vercel --prod
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings on vercel.com
   - Add all variables from `apps/server/.env`
   - Update URLs:
     - `SERVER_URL`: Your Vercel app URL
     - `WEB_URL`: Your GitHub Pages URL (next step)

5. Get your Vercel app URL (e.g., `https://hd-server.vercel.app`)

6. Update Google OAuth origins and redirect URIs:
   - JavaScript origins: `https://YOUR-VERCEL-APP.vercel.app`
   - Redirect URIs: `https://YOUR-VERCEL-APP.vercel.app/auth/google/callback`

**Cost: $0/month** ✅

### Deploy Web to GitHub Pages (Free)

1. Update `apps/web/vite.config.ts`:
```typescript
base: '/hd/', // Change to '/YOUR-REPO-NAME/'
```

2. Update `apps/web/src/main.tsx`:
```typescript
<BrowserRouter basename="/hd"> // Change to "/YOUR-REPO-NAME"
```

3. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

4. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: "GitHub Actions"

5. Add GitHub Secrets:
   - Go to repo Settings → Secrets and variables → Actions
   - Add:
     - `VITE_API_URL`: Your Vercel backend URL
     - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID

6. GitHub Actions will auto-deploy on every push

7. Update Google OAuth origins and redirect URIs:
   - JavaScript origins: `https://YOUR-GITHUB-USERNAME.github.io`
   - Redirect URIs: `https://YOUR-GITHUB-USERNAME.github.io/auth/google/callback`

**Cost: $0/month** ✅

### Deploy Mobile via Expo Go (Free)

1. Create free Expo account at [expo.dev](https://expo.dev)

2. Login:
```bash
cd apps/mobile
npx expo login
```

3. Update `apps/mobile/app.json`:
```json
"extra": {
  "apiUrl": "https://YOUR-VERCEL-APP.vercel.app",
  "googleClientId": "YOUR-CLIENT-ID.apps.googleusercontent.com"
}
```

4. Publish:
```bash
npx expo publish
```

5. Share the generated QR code or link with users

**Cost: $0/month** ✅

---

## 💰 Total Monthly Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Sandbox (512MB) | **$0** |
| Vercel | Free Tier (100GB bandwidth) | **$0** |
| GitHub Pages | Free for public repos | **$0** |
| Google OAuth | Free API | **$0** |
| Expo Go | Free distribution | **$0** |
| **TOTAL** | | **$0/month** |

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Web loads at GitHub Pages URL
- [ ] Products display with images from GridFS
- [ ] Google Sign-In works
- [ ] Admin access for `xyzmail@gmail.com`
- [ ] Product creation (admin)
- [ ] Mark product as sold (admin)
- [ ] Favorite products (user)
- [ ] WhatsApp buttons work
- [ ] Mobile app loads from Expo Go
- [ ] Mobile auth works
- [ ] All FREE (no paid services)

---

## 🛠️ Development Workflow

### Adding New Products (Admin)

1. Sign in with `xyzmail@gmail.com`
2. Go to Admin Dashboard
3. Click "Add Product"
4. Upload images (stored in GridFS)
5. Fill details
6. Publish

### Marking Products as Sold

1. Go to Admin Dashboard
2. Find product
3. Click "Mark as Sold"
4. Product shows "SOLD" badge

### Viewing Analytics

1. Go to Admin Dashboard
2. See:
   - Total users
   - Total products
   - Top favorited products
   - Recent activity

---

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check MongoDB connection
# Verify MONGODB_URI in .env
# Ensure IP whitelist includes 0.0.0.0/0
```

### Images not loading

```bash
# GridFS stores images in MongoDB
# Verify MongoDB connection
# Check /images/:fileId endpoint
```

### Google OAuth fails

```bash
# Verify redirect URIs match exactly
# Check Google Client ID/Secret
# Ensure Google+ API is enabled
```

### Vercel deployment fails

```bash
# Check build logs
# Verify all env vars are set
# Ensure Node.js version matches (18+)
```

---

## 📱 Mobile App (Detailed)

### Using Expo Go (Free)

1. Install Expo Go on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start development server:
```bash
pnpm --filter mobile start
```

3. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Publishing to Expo (Free)

```bash
cd apps/mobile
npx expo publish
```

Users scan the QR code to access your app - **no App Store fees!**

### Building Standalone Apps (Optional, Requires Paid Accounts)

**Only if you want App Store/Play Store distribution:**

```bash
# iOS (requires Apple Developer Account - $99/year)
eas build --platform ios

# Android (requires Play Store account - $25 one-time)
eas build --platform android
```

**Recommendation:** Stick with Expo Go for 100% free distribution.

---

## 🎨 Customization

### Brand Colors

Edit `packages/types/src/index.ts`:

```typescript
export const brandColors: BrandColors = {
  primary: '#A83279',    // Deep Magenta
  accent: '#D4AF37',     // Gold
  background: '#FFF8F0', // Ivory
  muted: '#F5E6EA',      // Soft Pink
  text: '#2B2B2B',       // Charcoal
};
```

### Logo

Replace files in `apps/web/public/branding/`:
- `logo-light.svg`
- `favicon.svg`

---

## 📞 Support

- WhatsApp: [+91 99166 32308](https://wa.me/919916632308)
- Location: [View on Google Maps](https://www.google.de/maps/place/H%26D+Boutique/@12.8950787,77.6121472,17z)

---

## ✨ Success!

You now have a fully functional, production-ready e-commerce platform running on **100% free services**!

**Next Steps:**
1. Customize branding
2. Add real product photos
3. Share your site
4. Start selling!

---

**Built with ❤️ for H & D Boutique**

*All services remain free forever (within tier limits). No hidden costs.*
