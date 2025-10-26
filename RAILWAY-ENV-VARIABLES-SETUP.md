# Set Environment Variables in Railway

## 🚨 ERROR MESSAGE

```
DATABASE_URL Field required
JWT_SECRET Field required
```

## ✅ SOLUTION

### Step 1: Get DATABASE_URL

1. In Railway, click on your **PostgreSQL** service
2. Go to "Variables" tab
3. Find `DATABASE_URL` 
4. Copy the entire connection string

It looks like:
```
postgresql://postgres:password@host:port/database
```

### Step 2: Add Variables to API Service

1. In Railway, click on your **API service**
2. Click "Variables" tab
3. Click "New Variable" (or "+" button)

### Step 3: Add These Variables

**Variable 1:**
- **Name**: `DATABASE_URL`
- **Value**: (paste the DATABASE_URL from PostgreSQL service)

**Variable 2:**
- **Name**: `JWT_SECRET`
- **Value**: `your-super-secret-key-change-this-to-something-random`

**Variable 3:**
- **Name**: `JWT_ALGORITHM`
- **Value**: `HS256`

**Variable 4:**
- **Name**: `JWT_EXPIRES_MINUTES`
- **Value**: `43200`

**Variable 5:**
- **Name**: `CORS_ORIGINS`
- **Value**: `*` (or your frontend URL)

### Step 4: Save and Redeploy

1. Click "Save" or "Update"
2. Railway will automatically redeploy
3. Check logs - should work now!

## 🎯 Quick Checklist

- [ ] Added `DATABASE_URL` from PostgreSQL service
- [ ] Added `JWT_SECRET` (any random string)
- [ ] Added `JWT_ALGORITHM` = `HS256`
- [ ] Added `JWT_EXPIRES_MINUTES` = `43200`
- [ ] Added `CORS_ORIGINS` = `*`
- [ ] Saved all variables
- [ ] Redeployed
- [ ] Check logs - success!

## 📸 Visual Guide

```
Railway Dashboard
├── PostgreSQL Service
│   └── Variables Tab
│       └── DATABASE_URL: postgresql://...
│
└── API Service
    └── Variables Tab
        ├── DATABASE_URL: (copy from above)
        ├── JWT_SECRET: your-random-key
        ├── JWT_ALGORITHM: HS256
        ├── JWT_EXPIRES_MINUTES: 43200
        └── CORS_ORIGINS: *
```

## 💡 Pro Tip

After adding variables and redeploying, check the logs. You should see:
- `Uvicorn running on http://0.0.0.0:8000`
- `Application startup complete`
- No more "Field required" errors!
