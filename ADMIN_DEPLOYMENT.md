# Admin Panel Deployment Guide

## Environment Setup

1. **Create `.env` file** in admin directory:
   ```
   VITE_BACKEND_URL=https://ordan-production.up.railway.app
   ```

2. **For Vercel Deployment**:
   - Go to your admin project settings in Vercel
   - Add environment variable: `VITE_BACKEND_URL` = `https://ordan-production.up.railway.app`
   - Redeploy your admin panel

3. **For local development**, use:
   ```
   VITE_BACKEND_URL=http://localhost:4000
   ```

## Backend CORS Configuration
Your backend is already configured to accept requests from:
- `http://localhost:5174` (local admin)
- `https://ordan-admin.vercel.app` (deployed admin)
- All Vercel domains

## Verification Steps
1. After deployment, test admin panel connection
2. Check browser console for any CORS errors
3. Verify API endpoints are working correctly
