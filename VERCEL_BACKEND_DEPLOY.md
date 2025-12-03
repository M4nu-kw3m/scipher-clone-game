# Deploy Backend to Vercel (100% Free)

Vercel is completely free and perfect for Node.js backends!

## Important Note

Vercel is serverless, so we need to make a small adjustment to the backend for it to work properly.

## Step 1: Create vercel.json Configuration

Create a file `server/vercel.json` with this content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## Step 2: Update server.js for Vercel

Add this at the end of `server/server.js`:

```javascript
// Export for Vercel
export default httpServer;
```

## Step 3: Commit and Push Changes

```bash
cd c:\Users\HP\Downloads\scipher_clone_ui
git add .
git commit -m "Add Vercel configuration"
git push
```

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
npm install -g vercel
cd server
vercel
```

Follow the prompts:
- Login with GitHub
- Link to existing project or create new
- Deploy!

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository `scipher-clone-game`
4. **Root Directory**: `server`
5. Click **"Deploy"**

## Step 5: Add Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://scipher-game.web.app`

## Step 6: Get Your Backend URL

After deployment, Vercel gives you a URL like:
`https://scipher-clone-game.vercel.app`

## Step 7: Update Frontend

Update `scipher_clone_ui/src/hooks/useSocket.js`:

```javascript
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-project.vercel.app' 
  : 'http://localhost:3000';
```

## Step 8: Redeploy Frontend

```bash
cd scipher_clone_ui
npm run build
firebase deploy --only hosting
```

## Done! 🎉

**Vercel Benefits:**
- ✅ 100% Free forever
- ✅ No credit card required
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy on git push
- ✅ Unlimited bandwidth

## Alternative: If You Want DigitalOcean

DigitalOcean requires payment ($4-6/month minimum):
1. Create a Droplet (Ubuntu)
2. SSH into server
3. Install Node.js
4. Clone your repo
5. Run with PM2

**Recommendation**: Use Vercel - it's free, easier, and perfect for this project!
