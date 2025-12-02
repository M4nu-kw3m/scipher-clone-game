# Vercel Deployment (Alternative to Firebase)

## Quick Deploy to Vercel

Vercel is a great alternative to Firebase Hosting - it's free, fast, and requires no manual setup.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd scipher_clone_ui
   vercel
   ```

3. **Follow Prompts**
   - Login with GitHub/GitLab/Bitbucket
   - Confirm project settings
   - Deploy!

### Configuration

Vercel will auto-detect Vite and use the correct build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Environment Variables

After deployment, add your backend URL:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `VITE_BACKEND_URL` = your Render backend URL

That's it! Your app will be live at `https://your-project.vercel.app`
