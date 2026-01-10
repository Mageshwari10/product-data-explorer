# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub, GitLab, or Bitbucket repository with your code

### Steps

1. **Push your code to a Git repository**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Sign in with your Git provider account
   - Select your repository

3. **Configure deployment**
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   In Vercel dashboard:
   - Add `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
   - Replace with your actual Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Frontend URL
Your frontend will be available at: `https://your-project.vercel.app`

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free at https://render.com)
- GitHub, GitLab, or Bitbucket repository with your code
- PostgreSQL database (Render provides a free tier)

### Steps

1. **Push your code to a Git repository**
   ```bash
   git push origin main
   ```

2. **Create a PostgreSQL Database on Render**
   - Go to https://dashboard.render.com
   - Click "New +"
   - Select "PostgreSQL"
   - Name: `product-explorer-db`
   - Database name: `product_explorer`
   - Click "Create Database"
   - Copy the internal and external database URLs

3. **Create a Web Service on Render**
   - Click "New +"
   - Select "Web Service"
   - Connect your Git repository
   - Configure settings:
     - **Name**: `product-explorer-backend`
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`
     - **Plan**: Free

4. **Add Environment Variables**
   In Render dashboard, add these environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_HOST=<your_postgres_internal_host>
   DATABASE_PORT=5432
   DATABASE_USER=<postgres_user>
   DATABASE_PASSWORD=<postgres_password>
   DATABASE_NAME=product_explorer
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

### Backend URL
Your backend will be available at: `https://product-explorer-backend.onrender.com`

---

## Update Frontend After Backend Deployment

Once your backend is deployed on Render:

1. Go to Vercel project settings
2. Update the `NEXT_PUBLIC_API_URL` environment variable to your Render URL
3. Trigger a redeployment or wait for the next push

---

## Local Development (.env setup)

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=product_explorer
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Troubleshooting

### Frontend not connecting to backend
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure backend's CORS is enabled (it should be in the code)
- Check browser console for error messages

### Backend won't start on Render
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure PostgreSQL database URL is correct
- Check that `npm run start:prod` works locally

### Database connection issues
- Verify credentials in environment variables
- Check that Postgres service is running
- For Render, use the internal database URL for services in same region
- Use external URL if connecting from outside Render

