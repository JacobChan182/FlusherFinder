# Deploy FlushFinder to Firebase + Supabase

This guide shows how to deploy your FlushFinder app using Firebase Hosting for the frontend and Supabase for the database and API.

## 📋 Overview

- **Frontend**: Firebase Hosting
- **Database**: Supabase (PostgreSQL)
- **API**: Supabase Edge Functions (Node.js) or rewrite in Supabase's REST API

## 🚀 Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project" → Sign up/Login
3. Click "New project"
4. Fill in:
   - **Name**: FlushFinder
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project"

### 1.2 Get Your Supabase Credentials

1. Click on "Project Settings" (gear icon)
2. Go to "API" section
3. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep secret!)

### 1.3 Set Up Database Schema

In Supabase Dashboard:

1. Go to "SQL Editor"
2. Run your database schema:

```sql
-- Enable uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(320) UNIQUE NOT NULL,
    display_name VARCHAR(120),
    hashed_password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create restrooms table
CREATE TABLE IF NOT EXISTS restrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    accessibility_features JSONB,
    average_rating NUMERIC(2, 1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, restroom_id)
);
```

### 1.4 Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Anyone can read restrooms
CREATE POLICY "Anyone can view restrooms" ON restrooms
    FOR SELECT USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read all reviews
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);
```

## 🔥 Step 2: Set Up Firebase

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase in Your Project

```bash
cd /Users/jacobchan/Temp
firebase init
```

Select:
- ✅ **Hosting**
- Select "Use an existing project" or "Create a new project"
- Public directory: `frontend/build`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (we'll build manually)

### 2.4 Configure Firebase Hosting

Create `firebase.json`:

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

### 2.5 Create `.env.production`

```bash
cd frontend
cat > .env.production << EOF
REACT_APP_API_BASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF
```

## 🚀 Step 3: Build and Deploy

### 3.1 Build Frontend

```bash
cd frontend
npm run build
```

### 3.2 Deploy to Firebase

```bash
firebase deploy --only hosting
```

## 🎉 Step 4: Access Your Deployed App

Your app will be available at:
```
https://your-project-id.web.app
```

## 📚 Alternative: Use Supabase Edge Functions for API

If you need custom API logic, create Edge Functions:

### 4.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 4.2 Initialize Supabase

```bash
cd /Users/jacobchan/Temp
supabase init
```

### 4.3 Create Edge Function

```bash
supabase functions new my-api
```

### 4.4 Deploy Edge Function

```bash
supabase functions deploy my-api
```

## 🔧 Environment Variables

Set these in Firebase Console → Project Settings → Environment Variables (for Firebase Functions)

Or use `.env.production` in your frontend build.

## 📖 Next Steps

1. Set up custom domain in Firebase Console
2. Enable SSL/HTTPS (automatic with Firebase)
3. Set up CI/CD with GitHub Actions
4. Configure CDN and caching rules

## 🆘 Troubleshooting

### Build Fails
```bash
cd frontend
rm -rf node_modules build
npm install
npm run build
```

### Environment Variables Not Working
- Make sure `.env.production` is in `frontend/`
- Restart Firebase hosting after changes

### Database Connection Issues
- Check Supabase credentials in `.env.production`
- Verify RLS policies are set correctly

## 📝 Notes

- Firebase Hosting is free for small projects
- Supabase free tier includes:
  - 500 MB database space
  - 2 GB bandwidth
  - 50,000 monthly active users
- Consider upgrading as your app grows

Enjoy your deployed FlushFinder app! 🚀
