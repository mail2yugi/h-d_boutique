# H & D Boutique Backend

Node.js + Express + TypeScript backend for H & D Boutique e-commerce platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Free Cluster)
- **Storage**: MongoDB GridFS (Free)
- **Auth**: JWT + Google OAuth
- **Deployment**: Vercel Serverless Functions (Free)

## Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
pnpm dev

# Seed database
pnpm seed
```

## Deployment

### Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard.

### Alternative: Glitch (Free)

1. Create new Glitch project
2. Import from GitHub
3. Add environment variables in `.env`
4. Project will auto-start

## API Endpoints

### Public

- `GET /health` - Health check
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /images/:fileId` - Serve image from GridFS

### Authentication

- `POST /auth/google` - Google OAuth callback
- `POST /auth/logout` - Logout

### User (Authenticated)

- `GET /api/users/me` - Get current user
- `GET /api/users/activities` - Get user activities
- `GET /api/favorites` - Get favorites
- `POST /api/favorites/:productId/toggle` - Toggle favorite
- `GET /api/favorites/:productId/check` - Check if favorited

### Admin Only

- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `POST /api/products/:id/sold` - Mark as sold
- `DELETE /api/products/:id` - Delete product
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/activities` - List all activities

## Environment Variables

See `.env.example` for required variables.

## GridFS Image Storage

All product images are stored in MongoDB GridFS (free, no external storage needed).

Upload: Images sent as multipart form data are stored in GridFS.
Serve: `/images/:fileId` streams images from GridFS.

## Cost: $0/month

100% free using:
- Vercel Free Plan
- MongoDB Atlas Free Cluster (M0)
- GridFS (included with MongoDB)
