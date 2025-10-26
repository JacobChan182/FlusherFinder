# How to Fix Railway "No active deployment" Error

## 🚨 Problem

Railway is looking at your repo root instead of the `apps/api` directory.

You see this error:
```
Nixpacks was unable to generate a build plan for this app.
```

The build context shows the ROOT of your repo (frontend/, docker-compose.yml, etc.) instead of just the API code.

## ✅ Solution

### Step 1: Go to API Service Settings
1. In Railway, click on your API service
2. Click the "Settings" tab (gear icon)
3. Scroll down to "Root Directory" or "Working Directory"

### Step 2: Set Root Directory
1. In the "Root Directory" field, enter: `apps/api`
2. Click "Save" or "Update"

### Step 3: Deploy
1. After saving, Railway will automatically trigger a new deployment
2. Or click "Deploy" in the Deployments tab
3. You should see it building from `apps/api` now

## 📸 What to Look For

**Before fix:** Build shows repo root files:
- docker-compose.yml
- frontend/
- apps/
- start-all.sh

**After fix:** Build shows API files:
- requirements.txt
- src/
- pyproject.toml
- nixpacks.toml

## 🎯 Quick Checklist

- [ ] Went to API service → Settings
- [ ] Set "Root Directory" to: `apps/api`
- [ ] Saved changes
- [ ] Redeployed
- [ ] Build now shows API files

## 🆘 Still Not Working?

If you don't see a "Root Directory" setting:

1. Delete the service and recreate it
2. When creating, look for "Root Directory" field
3. Set it to `apps/api` from the start

Or try using the Railway CLI:

```bash
railway link
railway variables set NIXPACKS_PROJECT_DIR=apps/api
railway up
```
