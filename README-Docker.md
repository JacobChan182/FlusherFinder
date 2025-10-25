# FlushFinder Docker Database Setup

This guide will help you set up a complete Docker-based database solution for FlushFinder.

## 🐳 What's Included

- **PostgreSQL Database** with PostGIS for spatial data
- **Redis Cache** for performance
- **Python API** with database integration
- **React Frontend** containerized
- **Sample data** for testing

## 🚀 Quick Start

### 1. Start All Services
```bash
docker-compose up -d
```

### 2. Check Services
```bash
docker-compose ps
```

### 3. View Logs
```bash
docker-compose logs -f
```

## 📊 Database Schema

### Tables Created:
- **users** - User accounts and profiles
- **restrooms** - Restroom locations with spatial data
- **reviews** - User reviews and ratings
- **favorites** - User favorite restrooms

### Key Features:
- **Spatial indexing** for location-based queries
- **UUID primary keys** for security
- **PostGIS support** for geographic data
- **Sample data** for immediate testing

## 🔧 Configuration

### Environment Variables:
Copy `env.example` to `.env` and update:
```bash
cp env.example .env
```

### Database Connection:
- **Host**: localhost
- **Port**: 5432
- **Database**: flushfinder
- **User**: flushfinder_user
- **Password**: flushfinder_password

## 🛠️ Development Commands

### Start Services:
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres
```

### Stop Services:
```bash
docker-compose down
```

### Reset Database:
```bash
docker-compose down -v
docker-compose up -d
```

### Access Database:
```bash
# Connect to PostgreSQL
docker exec -it flushfinder_db psql -U flushfinder_user -d flushfinder

# View tables
\dt

# Run queries
SELECT * FROM restrooms;
```

## 📱 API Endpoints

Once running, your API will be available at:
- **API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: localhost:5432

## 🔍 Sample Queries

### Find nearby restrooms:
```sql
SELECT name, address, 
       ST_Distance(location, ST_SetSRID(ST_MakePoint(-73.9855, 40.7580), 4326)) as distance
FROM restrooms 
WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(-73.9855, 40.7580), 4326), 1000)
ORDER BY distance;
```

### Get restroom with reviews:
```sql
SELECT r.name, r.address, AVG(rev.rating) as avg_rating, COUNT(rev.id) as review_count
FROM restrooms r
LEFT JOIN reviews rev ON r.id = rev.restroom_id
GROUP BY r.id, r.name, r.address;
```

## 🐛 Troubleshooting

### Database Connection Issues:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Port Conflicts:
If ports 3000, 5432, or 8000 are in use:
```bash
# Edit docker-compose.yml and change port mappings
ports:
  - "3001:3000"  # Frontend on 3001
  - "5433:5432"  # Database on 5433
  - "8001:8000"  # API on 8001
```

## 📈 Performance Tips

1. **Use Redis** for caching frequent queries
2. **Spatial indexes** are automatically created
3. **Connection pooling** in your API
4. **Regular VACUUM** for PostgreSQL maintenance

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for secrets
- Enable SSL for database connections
- Regular security updates for containers
