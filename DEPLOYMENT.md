# NutriCare Deployment Guide

This guide will help you deploy your NutriCare application with the frontend on Vercel and backend on Render.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: For frontend deployment
3. **Render Account**: For backend deployment
4. **MongoDB Atlas**: For database (already configured)

## Step 1: Backend Deployment (Render)

### 1.1 Prepare Backend for Deployment

The backend is already configured in the `server/` directory with:
- `server/package.json` - Dependencies and scripts
- `server/index.js` - Main server file
- `server/env.example` - Environment variables template

### 1.2 Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `nutricare-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

5. **Add Environment Variables:**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `FRONTEND_URL`: Your Vercel frontend URL (add after frontend deployment)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `GEMINI_API_KEY`: Your Google Gemini API key

6. **Click "Create Web Service"**

### 1.3 Get Backend URL

After deployment, Render will provide a URL like:
`https://nutricare-backend-xyz.onrender.com`

## Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend for Deployment

The frontend is configured in the `client/` directory with:
- `client/package.json` - Dependencies and scripts
- `client/vite.config.ts` - Vite configuration
- `client/vercel.json` - Vercel configuration

### 2.2 Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://nutricare-backend-xyz.onrender.com/api`)

6. **Click "Deploy"**

### 2.3 Get Frontend URL

After deployment, Vercel will provide a URL like:
`https://nutricare-frontend-xyz.vercel.app`

## Step 3: Update Environment Variables

### 3.1 Update Backend (Render)

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel frontend URL
5. Redeploy the service

### 3.2 Update Frontend (Vercel)

1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to "Settings" → "Environment Variables"
4. Update `VITE_API_URL` with your Render backend URL + `/api`
5. Redeploy the project

## Step 4: Test Your Deployment

1. **Test Backend Health**: Visit `https://your-backend-url.onrender.com/api/ping`
2. **Test Frontend**: Visit your Vercel URL
3. **Test API Integration**: Try logging in/registering on the frontend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is correctly set in backend environment variables
2. **API Connection Issues**: Verify `VITE_API_URL` is correct in frontend environment variables
3. **Database Connection**: Check MongoDB Atlas network access and connection string
4. **Build Failures**: Check build logs in Vercel/Render for dependency issues

### Environment Variables Checklist

**Backend (Render):**
- [ ] `MONGO_URI`
- [ ] `JWT_SECRET`
- [ ] `FRONTEND_URL`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `GEMINI_API_KEY`

**Frontend (Vercel):**
- [ ] `VITE_API_URL`

## Security Notes

1. **Never commit sensitive environment variables** to your repository
2. **Use strong JWT secrets** (32+ characters)
3. **Enable MongoDB Atlas network security** (IP whitelist or VPC)
4. **Use HTTPS** (both Vercel and Render provide this automatically)

## Monitoring

- **Vercel**: Check deployment status and logs in dashboard
- **Render**: Monitor service health and logs
- **MongoDB Atlas**: Monitor database performance and connections

## Cost Optimization

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month
- **MongoDB Atlas**: Free tier includes 512MB storage

Your NutriCare application should now be fully deployed and accessible online!
