# Deploy FlushFinder to Railway

This guide will help you deploy your FlushFinder app to Railway step by step.

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure you have committed all changes:

```bash
git add .
git commit -m "Add Railway deployment files"
git push origin main
```

### Step 2: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Authorize Railway to access your repositories

### Step 3: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (FlushFinder)
4. Click "Deploy Now"

### Step 4: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Click "Add PostgreSQL"
4. Wait for it to provision

### Step 5: Get Database URL

1. Click on the PostgreSQL service
2. Go to "Variables" tab
3. Copy the `DATABASE_URL` value
4. Save this! You'll need it for the API

### Step 6: Configure API Service

1. In your Railway project, click "+ New"
2. Select "GitHub Repo"
3. Select your repository again
4. Railway will detect it's a Python project

**Configure the service**:

- **Root Directory**: Set this to `apps/api`
- **Build Command**: Leave empty (will auto-detect from Dockerfile)
- **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Step 7: Add Environment Variables

In the API service, go to "Variables" and add:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=43200
CORS_ORIGINS=https://your-frontend-domain.railway.app
PORT=8000
```

**Note**: Replace `${{Postgres.DATABASE_URL}}` with the actual DATABASE_URL you copied earlier, or use Railway's variable reference syntax.

### Step 8: Add Frontend Service (Optional)

For the React frontend:

1. Click "+ New" → "Static Site"
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Output Directory**: `build`

### Step 9: Configure Frontend Environment

Add to frontend environment variables:

```
REACT_APP_API_BASE_URL=https://your-api-url.railway.app
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 10: Deploy!

1. Railway will automatically start building
2. Monitor the logs in the "Deployments" tab
3. Wait for "Deploy successful" message

### Step 11: Get Your URLs

1. Click on each service
2. Go to "Settings" → "Domains"
3. Railway provides automatic domains
4. Copy the URLs for:
   - API: `https://your-api.railway.app`
   - Frontend: `https://your-frontend.railway.app`

## 🐛 Troubleshooting

### Build Fails - "Could not find requirements.txt"

**Solution**: Make sure you've created `apps/api/requirements.txt` and it's committed to git.

### API Can't Connect to Database

**Solution**: 
1. Check that DATABASE_URL is correctly set in API environment variables
2. Make sure PostgreSQL service is running
3. Verify the connection string format

### Frontend Build Fails

**Solution**:
1. Check that all dependencies are in `package.json`
2. Make sure Node.js version is compatible
3. Check build logs for specific errors

### Port Already in Use

**Solution**: 
1. Make sure start command uses `$PORT` environment variable
2. Don't hardcode port numbers

### API Routes Return 404

**Solution**:
1. Check that the API is running with correct CORS settings
2. Verify the API_BASE_URL in frontend environment variables
3. Check API logs for errors

## 📝 Quick Reference

### Railway CLI (Alternative Method)

If you prefer CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

### Useful Railway Commands

```bash
# View logs
railway logs

# View all services
railway service

# Open in browser
railway open
```

### Environment Variables Setup

For each service, add these variables:

**API Service**:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-secret
CORS_ORIGINS=https://your-frontend.railway.app
```

**Frontend Service**:
```
REACT_APP_API_BASE_URL=https://your-api.railway.app
REACT_APP_GOOGLE_MAPS_API_KEY=your-key
```

## 🎉 Success!

Once deployed, your app will be live at:
- **API**: `https://your-api.railway.app`
- **Frontend**: `https://your-frontend.railway.app`
- **Database**: Managed by Railway (internal)

## 📚 Next Steps

1. Set up custom domains
2. Enable SSL/HTTPS (automatic with Railway)
3. Set up monitoring and alerts
4. Configure backup schedules for database
5. Set up CI/CD for automatic deployments

## 💰 Cost Estimation

Railway pricing:
- **Free**: $5 credit/month
- **Developer**: $5/month + usage
- **Team**: $10/month + usage

Typical costs for FlushFinder:
- PostgreSQL: ~$5/month
- API: ~$7/month (if constantly running)
- Frontend: Free (static hosting)

**Total**: ~$12-20/month

Enjoy your deployed FlushFinder app! 🚀
