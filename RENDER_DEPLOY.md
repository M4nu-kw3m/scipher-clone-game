# Deploy Backend to Render - Complete Guide

Your code is now on GitHub! Follow these steps to deploy the backend to Render.

## Step 1: Go to Render Dashboard

1. Open [Render Dashboard](https://dashboard.render.com)
2. Sign in (or create account with GitHub)

## Step 2: Create New Web Service

1. Click **New +** button (top right)
2. Select **Web Service**
3. Click **Connect** next to your GitHub account (if not already connected)
4. Find and select `scipher-clone-game` repository
5. Click **Connect**

## Step 3: Configure Service

Fill in these settings:

### Basic Settings
- **Name**: `scipher-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Instance Type
- **Plan**: `Free` (select the free tier)

## Step 4: Environment Variables

Click **Advanced** and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://scipher-game.web.app` |
| `PORT` | `3000` |

## Step 5: Deploy!

1. Click **Create Web Service**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://scipher-backend.onrender.com`)

## Step 6: Update Frontend

Update the frontend to use your Render backend:

1. Open `scipher_clone_ui/src/hooks/useSocket.js`
2. Change this line:
   ```javascript
   const SERVER_URL = 'http://localhost:3000';
   ```
   To:
   ```javascript
   const SERVER_URL = process.env.NODE_ENV === 'production' 
     ? 'https://YOUR-RENDER-URL.onrender.com' 
     : 'http://localhost:3000';
   ```
3. Replace `YOUR-RENDER-URL` with your actual Render URL

## Step 7: Redeploy Frontend

```bash
cd scipher_clone_ui
npm run build
firebase deploy --only hosting
```

## Done! 🎉

Your app is now fully deployed:
- **Frontend**: https://scipher-game.web.app
- **Backend**: https://your-render-url.onrender.com

Test it by opening the frontend URL and creating a game room!

## Troubleshooting

### Backend not responding
- Check Render logs in the dashboard
- Verify environment variables are set correctly
- Make sure `CLIENT_URL` matches your Firebase URL exactly

### CORS errors
- Double-check `CLIENT_URL` environment variable
- Ensure it includes `https://` and no trailing slash

### Free tier limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier ($7/month) for always-on service
