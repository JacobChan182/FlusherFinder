# Setup Washroom Tables in Railway

## 🚨 Problem
Your Railway database is missing the `washrooms`, `amenities`, and `washroom_amenities` tables needed for the add washroom feature.

## ✅ Quick Fix (2 minutes)

### Step 1: Open Railway PostgreSQL Console

1. Go to https://railway.app
2. Log into your account
3. Open your FlushFinder project
4. Click on the **PostgreSQL** service

### Step 2: Open Query/Data Tab

1. Look for a tab called:
   - **"Query"** or 
   - **"Data"** or
   - **"SQL Editor"** or
   - **"Console"**
2. Click on it

### Step 3: Run the SQL Script

1. Copy the entire contents of `railway-washroom-schema.sql`
2. Paste it into the query editor
3. Click **"Run"** or **"Execute"** button
4. You should see: "Tables created successfully!"

### Step 4: Redeploy API

1. Go back to your Railway project
2. Click on your **API service** (Python service)
3. Go to **"Deployments"** tab
4. Click **"Redeploy"** or trigger a new deployment
5. Wait for it to complete

### Step 5: Test!

1. Go to https://flusherfinder.web.app
2. Try adding a washroom
3. It should work now! 🎉

---

## 🐛 Alternative: From Terminal

If you prefer using terminal:

```bash
# 1. Get your Railway DATABASE_URL
# Go to Railway → PostgreSQL → Variables → Copy DATABASE_URL

# 2. Run the SQL
psql "YOUR_DATABASE_URL_HERE" < railway-washroom-schema.sql

# Or with inline SQL:
psql "YOUR_DATABASE_URL_HERE" -c "$(cat railway-washroom-schema.sql)"
```

---

## ✅ Verify It Worked

In Railway PostgreSQL console, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('washrooms', 'amenities', 'washroom_amenities');
```

You should see all 3 tables listed.

---

## 📝 What This Does

This SQL script creates:
- ✅ `washrooms` table - stores washroom locations with lat/lng
- ✅ `amenities` table - stores amenity codes and labels  
- ✅ `washroom_amenities` table - many-to-many relationship

These tables are required for the add washroom feature to work!
