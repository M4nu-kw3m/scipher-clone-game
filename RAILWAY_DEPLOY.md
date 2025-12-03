# Deploy Backend to Railway (Free Alternative)

Railway offers a generous free tier ($5 credit/month) which is perfect for the Scipher backend!

## Step 1: Sign Up for Railway

1. Go to [Railway](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub

## Step 2: Deploy from GitHub

1. Click **"Deploy from GitHub repo"**
2. Select **`M4nu-kw3m/scipher-clone-game`**
3. Railway will detect your project automatically

## Step 3: Configure the Service

Railway should auto-detect Node.js. If it asks for configuration:

1. **Root Directory**: `server`
2. **Start Command**: `node server.js`
3. **Build Command**: `npm install`

## Step 4: Add Environment Variables

1. Click on your service
2. Go to **"Variables"** tab
3. Add these variables:

```
NODE_ENV=production
CLIENT_URL=https://scipher-game.web.app
PORT=3000
```

## Step 5: Deploy!

1. Railway will automatically deploy
2. Wait 2-3 minutes for deployment
3. Click **"Settings"** → **"Generate Domain"** to get your public URL
4. Copy your backend URL (e.g., `https://scipher-backend-production.up.railway.app`)

## Step 6: Update Frontend

Update `scipher_clone_ui/src/hooks/useSocket.js`:

```javascript
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://YOUR-RAILWAY-URL.up.railway.app' 
  : 'http://localhost:3000';
```

Replace `YOUR-RAILWAY-URL` with your actual Railway URL.

## Step 7: Redeploy Frontend

```bash
cd scipher_clone_ui
npm run build
firebase deploy --only hosting
```

## Done! 🎉

Your app is fully deployed:
- **Frontend**: https://scipher-game.web.app
- **Backend**: https://your-railway-url.up.railway.app

## Railway Free Tier

- **$5 credit/month** (usually enough for small projects)
- **500 hours** of usage
- Automatically sleeps after inactivity (wakes up on request)
- No credit card required initially

## Alternative: Render Free Tier

If you want to try Render's free tier:
- It may require verification
- Limited to 750 hours/month
- Spins down after 15 minutes of inactivity

Choose Railway for the easiest free deployment!
