# Add Firebase Service Account to Vercel

## The Issue
The `FIREBASE_SERVICE_ACCOUNT` environment variable is missing from Vercel, which is why room creation fails.

## Steps to Fix

1. Go to [Vercel Environment Variables](https://vercel.com/voids-projects-705600c7/scipher-backend/settings/environment-variables)

2. Click **"Add New"** or the **"+"** button

3. Fill in:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Paste the entire Firebase JSON (the one you pasted in chat earlier)
   - **Environment**: Select **Production** only

4. Click **Save**

## The JSON Value
Use the complete JSON you pasted earlier that starts with:
```json
{
  "type": "service_account",
  "project_id": "scipher-game",
  ...
}
```

## After Adding
Once saved, I'll redeploy the backend and the room creation will work!
