# Firebase Setup for Vercel

## Get Firebase Service Account Key

1. Go to [Firebase Console - Service Accounts](https://console.firebase.google.com/project/scipher-game/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Download the JSON file
4. Copy the entire contents

## Add to Vercel

The JSON content needs to be added as an environment variable in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/voids-projects-705600c7/scipher-backend/settings/environment-variables)
2. Add new variable:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Paste the entire JSON content
   - **Environment**: Production
3. Add another variable:
   - **Name**: `FIREBASE_DB_URL`
   - **Value**: `https://scipher-game-default-rtdb.firebaseio.com`
   - **Environment**: Production

## Redeploy

After adding the variables, redeploy:
```bash
cd server
vercel --prod
```
