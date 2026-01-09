# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your H & D Boutique web app to GitHub Pages.

## ✅ Prerequisites

Your project is already configured with:
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Vite base path configured (`/h-d_boutique/`)
- ✅ Build scripts in package.json

## 📋 Step-by-Step Deployment

### 1. **Enable GitHub Pages on Your Repository**

1. Go to your GitHub repository: `https://github.com/mail2yugi/h-d_boutique`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar under "Code and automation")
4. Under **Source**, select:
   - Source: `GitHub Actions`
5. Click **Save**

### 2. **Set Up Environment Variables (Required for API)**

Your app uses environment variables for the backend API. You need to add these as GitHub Secrets:

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `VITE_API_URL`
   - Value: Your backend API URL (e.g., `https://your-server.vercel.app` or your deployed server URL)

   **Secret 2 (if using Google OAuth):**
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth Client ID

### 3. **Push Your Code to GitHub**

If you haven't already pushed your code:

```bash
# Make sure you're in the project root
cd /Users/yugandhar.dhandusubramanyam/Public/hd

# Add all files
git add .

# Commit your changes
git commit -m "Configure GitHub Pages deployment"

# Push to main branch
git push origin main
```

### 4. **Monitor the Deployment**

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow run called "Deploy to GitHub Pages"
4. Click on it to see the deployment progress
5. Wait for both "build" and "deploy" jobs to complete (usually 2-5 minutes)

### 5. **Access Your Deployed Site**

Once deployment is complete, your site will be available at:

**🌐 https://mail2yugi.github.io/h-d_boutique/**

## 🔄 Automatic Deployments

From now on, every time you push to the `main` branch, GitHub Actions will automatically:
1. Install dependencies
2. Build your packages
3. Build your web app
4. Deploy to GitHub Pages

## 🛠️ Manual Deployment

You can also trigger a deployment manually:

1. Go to **Actions** tab on GitHub
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the branch (main)
5. Click **Run workflow**

## 📝 Important Notes

### Backend API Configuration

Your frontend is configured to connect to a backend API. Make sure:

1. ✅ Your backend server is deployed (e.g., on Vercel, Railway, or Render)
2. ✅ The `VITE_API_URL` secret is set correctly
3. ✅ CORS is configured on your backend to allow requests from:
   - `https://mail2yugi.github.io`
   - Development URLs if needed

### Testing Locally Before Deployment

To test the production build locally:

```bash
# Build the project
pnpm build

# Preview the production build
cd apps/web
pnpm preview
```

This will serve your production build at `http://localhost:4173/h-d_boutique/`

### Common Issues & Solutions

**Issue 1: 404 on page refresh**
- ✅ Already handled! The workflow creates a `404.html` file for SPA routing

**Issue 2: Images or assets not loading**
- Make sure all asset paths use the base path `/h-d_boutique/`
- Check the Vite config has `base: '/h-d_boutique/'`

**Issue 3: API calls failing**
- Verify the `VITE_API_URL` secret is set correctly
- Check backend CORS configuration
- Check browser console for specific errors

**Issue 4: Build fails**
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Test build locally first: `pnpm build`

## 🎯 Next Steps

After your first successful deployment:

1. **Test all features** on the live site
2. **Update your backend** to allow the GitHub Pages domain
3. **Set up a custom domain** (optional):
   - Go to Settings → Pages
   - Add your custom domain
   - Update DNS records
   - Update Vite config `base` path if needed

## 📞 Need Help?

If you encounter any issues:

1. Check the **Actions** tab for deployment logs
2. Look at the browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test the build locally first

---

**Repository:** https://github.com/mail2yugi/h-d_boutique  
**Live Site:** https://mail2yugi.github.io/h-d_boutique/  
**Deployment Status:** Check the Actions tab
