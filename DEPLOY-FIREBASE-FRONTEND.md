# Deploy Frontend to Firebase + Railway API

Yes! You can use Firebase Hosting for the frontend while Railway hosts your API and database.

## 📋 Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Firebase Hosting│ ───►│   Railway API    │ ───►│ Railway Postgres│
│   (Frontend)    │      │   (FastAPI)      │      │   (Database)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## 🚀 Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## 🔐 Step 2: Login to Firebase

```bash
firebase login
```

## 🎯 Step 3: Initialize Firebase in Your Project

```bash
cd /Users/jacobchan/Temp
firebase init
```

**Select these options:**
- ✅ **Hosting** (use arrow keys + space to select)
- Choose "Use an existing project" or "Create a new project"
- **Public directory**: `frontend/build`
- **Configure as single-page app**: **Yes**
- **Set up automatic builds**: **No**
- **File overwrite warning**: **No** (or Yes if you want)

## ⚙️ Step 4: Configure firebase.json

Your `firebase.json` should look like:

```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🔑 Step 5: Update Frontend Environment Variables

Create `frontend/.env.production`:

```bash
cd frontend
cat > .env.production << 'EOF'
REACT_APP_API_BASE_URL=https://your-api.railway.app
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EOF
```

**Important**: Replace `https://your-api.railway.app` with your actual Railway API URL!

## 🏗️ Step 6: Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates `frontend/build/` with the production files.

## 🚀 Step 7: Deploy to Firebase

```bash
firebase deploy --only hosting
```

## ✅ Step 8: Access Your App!

Firebase will give you a URL like:
```
https://your-project-id.web.app
```

## 🔄 Step 9: Update CORS in Railway API

In your Railway API service, update the `CORS_ORIGINS` environment variable:

1. Go to Railway → API service → Variables
2. Update `CORS_ORIGINS` to:
   ```
   https://your-project-id.web.app,https://your-project-id.firebaseapp.com
   ```
3. Save (auto-redeploys)

## 🔄 Automatic Deployment Workflow

### Option A: Manual Deploy (Current Setup)

Every time you make changes:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Option B: GitHub Actions (Automatic)

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Firebase

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build
        working-directory: ./frontend
        env:
          REACT_APP_API_BASE_URL: ${{ secrets.REACT_APP_API_BASE_URL }}
          REACT_APP_GOOGLE_MAPS_API_KEY: ${{ secrets.REACT_APP_GOOGLE_MAPS_API_KEY }}
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## 🆘 Troubleshooting

### Build Fails
```bash
cd frontend
rm -rf node_modules build
npm install
npm run build
```

### Environment Variables Not Working
Make sure `.env.production` exists in `frontend/` directory and is committed to git.

### CORS Errors
Update `CORS_ORIGINS` in Railway API to include your Firebase URL.

### 404 on Page Refresh
This is fixed by the `rewrites` rule in `firebase.json` - make sure it's correct!

## 📚 Quick Reference Commands

```bash
# Build frontend
cd frontend && npm run build

# Deploy to Firebase
firebase deploy --only hosting

# View deployment logs
firebase hosting:channel:list

# Undeploy (if needed)
firebase hosting:disable
```

## 🎉 Done!

Your setup is now:
- ✅ **Frontend**: Firebase Hosting (free, fast, global CDN)
- ✅ **API**: Railway (Python FastAPI)
- ✅ **Database**: Railway PostgreSQL

Enjoy your deployed FlushFinder app! 🚀
