# 🚀 WorkNest Backend Setup Guide

## Step-by-Step Installation

### Step 1: Install PostgreSQL & pgAdmin
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Use default settings (port 5432, password: postgres)
4. pgAdmin will be installed automatically

### Step 2: Create Database
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases"
4. Select "Create" → "Database"
5. Name it: `worknest_db`
6. Click "Save"

### Step 3: Environment Configuration
Create a `.env` file in the `project/backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_NAME=worknest_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=worknest_super_secret_jwt_key_2024
JWT_EXPIRES_IN=24h
```

### Step 4: Install Dependencies
```bash
cd project/backend
npm install
```

### Step 5: Setup Database
```bash
npm run setup
```

### Step 6: Start the Server
```bash
npm run dev
```

## 🧪 Testing the API

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@worknest.com",
    "password": "admin123"
  }'
```

## 📊 pgAdmin Database Management

### View Tables
1. Open pgAdmin
2. Navigate to: Servers → PostgreSQL → Databases → worknest_db → Schemas → public → Tables
3. You should see these tables:
   - `users`
   - `attendance`
   - `leaves`
   - `tasks`
   - `notices`

### View Sample Data
1. Right-click on any table
2. Select "View/Edit Data" → "All Rows"
3. You should see the default admin and staff users

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@worknest.com | admin123 |
| Staff | staff@worknest.com | staff123 |

## 📡 Available Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Protected Endpoints (Auth Required)
- `GET /api/auth/me` - Get user info
- `GET /api/users` - Get all users (admin only)
- `POST /api/upload` - Upload file

## 🐛 Troubleshooting

### Database Connection Issues
1. Check if PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists in pgAdmin

### Port Issues
1. Check if port 5000 is available
2. Change PORT in `.env` if needed

### JWT Issues
1. Ensure JWT_SECRET is set in `.env`
2. Use correct token format: `Bearer <token>`

## ✅ Success Indicators

When everything is working correctly:
- ✅ Server starts without errors
- ✅ Database connection successful
- ✅ Health endpoint returns 200
- ✅ Login endpoint works
- ✅ Tables visible in pgAdmin

## 🎯 Next Steps

1. **Test the API** using the endpoints above
2. **Connect your frontend** to these endpoints
3. **Implement remaining routes** (attendance, leaves, tasks, notices, reports)
4. **Customize** the system for your needs

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review error messages in the console
- Verify database connection in pgAdmin
- Test endpoints with curl or Postman 