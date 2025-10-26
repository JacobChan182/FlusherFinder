# How to Set Up Railway Database

## Problem
Railway PostgreSQL database is empty - no tables exist!

## Solution: Run SQL Schema

### Option 1: Using Railway's Web Console

1. Go to your Railway project
2. Click on the **PostgreSQL** service
3. Look for a tab called **"Data"** or **"Query"** or **"SQL Editor"**
4. Copy the contents of `init-api-compatible.sql`
5. Paste into the SQL editor
6. Click "Run" or "Execute"
7. Tables should be created!

### Option 2: Using psql from Terminal

1. Get connection string from Railway:
   - Go to PostgreSQL service → Variables
   - Copy `DATABASE_URL` or connection details

2. Connect:
```bash
psql "your-database-url-from-railway"
```

3. Run SQL:
```bash
\i init-api-compatible.sql
```

### Option 3: Using Docker exec (if PostgreSQL is local)

Not applicable - Railway manages this.

### After Running SQL:

You should see:
- ✅ users table created
- ✅ restrooms table created  
- ✅ reviews table created
- ✅ favorites table created
- ✅ Sample data inserted

Then your API will work!

## Verify It Worked

After running the SQL, check your API again. The login endpoint should work now.
