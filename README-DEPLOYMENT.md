# 🚀 Quick Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Render account (free)
- MongoDB Atlas (free tier)

## Quick Steps

### 1. Prepare Your Repository
```bash
# Run the setup script
./deploy-setup.sh

# Push to GitHub
git add .
git commit -m "Prepare for deployment"
git push
```

### 2. Deploy Backend (Render)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `nutricare-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (see `server/env.example`)
6. Deploy and get your backend URL

### 3. Deploy Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
5. Add environment variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
6. Deploy

### 4. Update Environment Variables
- Update `FRONTEND_URL` in Render with your Vercel URL
- Redeploy both services

## Environment Variables Needed

### Backend (Render)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-key
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Test Your Deployment
1. Visit your Vercel URL
2. Try registering/logging in
3. Check if API calls work

## Need Help?
- Check the full `DEPLOYMENT.md` guide
- Look at deployment logs in Vercel/Render
- Verify environment variables are set correctly

Your NutriCare app should now be live! 🎉
