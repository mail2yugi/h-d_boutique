# 🚀 Vercel Backend Deployment Guide

Deploy your H & D Boutique backend API to Vercel (100% FREE).

## ✅ Prerequisites

- ✅ MongoDB connection string (you already have this!)
- ✅ GitHub account
- ✅ Vercel account (free)

## 📋 Step-by-Step Deployment

### **Step 1: Sign Up/Login to Vercel**

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

### **Step 2: Import Your Repository**

1. Once logged in, click **"Add New..."** → **"Project"**
2. Find and select your repository: **`h-d_boutique`**
3. Click **"Import"**

### **Step 3: Configure the Project**

On the configuration page:

#### **Framework Preset:**
- Select: **Other** (or leave as detected)

#### **Root Directory:**
- Click **"Edit"**
- Enter: `apps/server`
- Click **"Continue"**

#### **Build Settings:**
- **Build Command:** `pnpm vercel-build` or `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install` or `npm install`

#### **Environment Variables:**
Click **"Add Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://hdadmin:O24zXu6L7a2pKXOm@hdclus01.8yotifp.mongodb.net/?appName=hdclus01` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your-super-secret-jwt-key-here-change-this` |
| `WEB_URL` | `https://mail2yugi.github.io` |
| `PORT` | `5001` |

**Important Security Note:** 
- Generate a strong `JWT_SECRET` (use a password generator)
- For production, consider using MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0 for Vercel)

### **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Once deployed, you'll see a success message with your URL

Your backend will be deployed at: `https://your-project-name.vercel.app`

### **Step 5: Test Your API**

Visit these URLs to test:
- Health check: `https://your-project-name.vercel.app/health`
- Products: `https://your-project-name.vercel.app/api/products`

### **Step 6: Update GitHub Secrets**

Now add your Vercel API URL to GitHub:

1. Go to: https://github.com/mail2yugi/h-d_boutique/settings/secrets/actions
2. Click **"New repository secret"**
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-project-name.vercel.app`
4. Click **"Add secret"**

### **Step 7: Redeploy Frontend**

1. Go to: https://github.com/mail2yugi/h-d_boutique/actions
2. Click **"Run workflow"** → **"Run workflow"**
3. Wait 2-3 minutes

---

## 🔒 MongoDB Atlas Configuration

### **Allow Vercel to Access MongoDB:**

1. Go to https://cloud.mongodb.com/
2. Select your cluster (**hdclus01**)
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **"Confirm"**

**Why?** Vercel uses dynamic IPs, so we need to allow all IPs. Your MongoDB connection string includes authentication, so it's still secure.

---

## 🔧 Troubleshooting

### **Build Fails:**

**Error: "Cannot find module 'mongoose'"**
- Vercel might not be installing dependencies from the monorepo root
- Solution: Make sure `Root Directory` is set to `apps/server`

**Error: "MONGODB_URI is not defined"**
- Check that environment variables are added correctly
- Variables are case-sensitive

### **CORS Errors:**

If you see CORS errors in the browser:
- Make sure `WEB_URL` is set to `https://mail2yugi.github.io`
- Check that CORS is configured in `src/index.ts`

### **MongoDB Connection Fails:**

**Error: "MongoNetworkError" or "Connection refused"**
- Make sure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify your connection string is correct
- Check that your MongoDB cluster is running

### **API Returns 404:**

- Verify the API URL is correct
- Check deployment logs in Vercel dashboard
- Make sure routes are properly configured

---

## 🎯 After Successful Deployment

Once both frontend and backend are deployed:

1. ✅ Visit: https://mail2yugi.github.io/h-d_boutique/
2. ✅ Products should load automatically
3. ✅ Sign in should work (if Google OAuth is configured)
4. ✅ All features should be functional

---

## 📝 Environment Variables Reference

Copy these for Vercel:

```env
MONGODB_URI=mongodb+srv://hdadmin:O24zXu6L7a2pKXOm@hdclus01.8yotifp.mongodb.net/?appName=hdclus01
NODE_ENV=production
JWT_SECRET=generate-a-strong-random-secret-here
WEB_URL=https://mail2yugi.github.io
PORT=5001
```

**Optional (if using Google OAuth):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🚀 Automatic Deployments

Vercel will automatically redeploy when you push to the `main` branch!

Every time you push code:
- ✅ Vercel rebuilds your backend
- ✅ GitHub Actions rebuilds your frontend
- ✅ Everything stays in sync

---

## 💰 Cost Summary

| Service | Free Tier | What You Get |
|---------|-----------|-------------|
| **Vercel** | ✅ Free forever | Unlimited deployments, 100GB bandwidth/month |
| **MongoDB Atlas** | ✅ Free forever | 512MB storage, shared CPU |
| **GitHub Pages** | ✅ Free forever | 1GB storage, 100GB bandwidth/month |
| **GitHub Actions** | ✅ Free forever | 2,000 minutes/month |

**Total Cost: $0/month** 🎉

---

## 📞 Need Help?

If you encounter issues:
1. Check the Vercel deployment logs
2. Check MongoDB Atlas connection
3. Verify all environment variables are set
4. Test each endpoint individually

**Your backend API URL will be:** `https://your-project-name.vercel.app`
