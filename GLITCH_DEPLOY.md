# Deploy Backend to Glitch (Free & Persistent)

Since Vercel is "serverless", it can't keep the game rooms open. **Glitch** is a perfect free alternative that keeps the server running!

## Step 1: Import to Glitch

1. Go to [Glitch.com](https://glitch.com) and sign in
2. Click **"New Project"** (top right)
3. Select **"Import from GitHub"**
4. Paste your repository URL:
   `https://github.com/M4nu-kw3m/scipher-clone-game`

## Step 2: Configure Glitch

Glitch will automatically install dependencies.

1. Open the **`.env`** file in the Glitch editor (on the left)
2. Add these variables:

```
NODE_ENV=production
CLIENT_URL=https://scipher-game.web.app
```

## Step 3: Get Your Backend URL

1. Click **"Share"** (top right)
2. Copy the **"Live Site"** link (e.g., `https://scipher-clone-game.glitch.me`)

## Step 4: Update Frontend

1. Update `scipher_clone_ui/src/hooks/useSocket.js` locally:

```javascript
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://YOUR-GLITCH-URL.glitch.me' 
  : 'http://localhost:3000';
```

2. Redeploy Frontend:
```bash
cd scipher_clone_ui
npm run build
firebase deploy --only hosting
```

## Done!

Glitch keeps the server running so your rooms will stay open!
*Note: Glitch projects sleep after 5 minutes of inactivity. Just open the URL to wake it up.*
