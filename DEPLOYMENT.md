# Scipher Deployment Guide

This guide covers deploying the Scipher Clone using **Firebase Hosting** (Frontend) and **Render** (Backend).

## Prerequisites
- Node.js installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- GitHub account (for Render deployment)

---

## 1. Backend Deployment (Render)

We use Render for the backend because it supports WebSockets (Socket.IO) on the free tier.

1. **Push Code to GitHub**
   - Push your project to a GitHub repository.

2. **Create Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New +** -> **Web Service**
   - Connect your GitHub repository
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

3. **Environment Variables**
   - Add `NODE_ENV` = `production`
   - Add `CLIENT_URL` = `https://your-firebase-app.web.app` (You'll get this in step 2)
   - (Optional) Add `FIREBASE_DB_URL` if using Realtime Database

4. **Copy Backend URL**
   - Once deployed, copy the URL (e.g., `https://scipher-backend.onrender.com`)

---

## 2. Frontend Deployment (Firebase)

1. **Update Socket Connection**
   - Open `scipher_clone_ui/src/hooks/useSocket.js`
   - Update `SERVER_URL` to your Render backend URL:
     ```javascript
     const SERVER_URL = process.env.NODE_ENV === 'production' 
       ? 'https://your-render-app.onrender.com' 
       : 'http://localhost:3000';
     ```

2. **Initialize Firebase**
   ```bash
   cd scipher_clone_ui
   firebase login
   firebase init hosting
   ```
   - Select **Use an existing project** or **Create a new project**
   - Public directory: `dist`
   - Configure as single-page app? **Yes**
   - Set up automatic builds and deploys with GitHub? **No** (or Yes if you want CI/CD)

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Done!**
   - Your app is now live at the Firebase URL provided.

---

## 3. Firebase Realtime Database (Optional)

To enable persistence:

1. Go to Firebase Console -> **Realtime Database** -> **Create Database**.
2. Go to **Project Settings** -> **Service Accounts**.
3. Generate new private key -> Save as `serviceAccountKey.json`.
4. **For Render**:
   - You can't upload the JSON file directly.
   - Instead, stringify the JSON content and add it as an environment variable `FIREBASE_SERVICE_ACCOUNT`.
   - Update `server/gameManager.js` to parse this env var if file doesn't exist.

## Local Development

1. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd scipher_clone_ui
   npm run dev
   ```

3. Open `http://localhost:5173`
