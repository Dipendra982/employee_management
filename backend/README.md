# WorkNest Backend API

A modern workplace management system backend built with Express.js and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- pgAdmin (for database management)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
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

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb worknest_db

# Run database setup
npm run setup
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Setup with pgAdmin

### 1. Install PostgreSQL & pgAdmin
- Download from: https://www.postgresql.org/download/
- Install with default settings
- pgAdmin will be installed automatically

### 2. Connect to Database
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Create a new database named `worknest_db`
4. Run the setup script: `npm run setup`

### 3. Verify Tables
In pgAdmin, you should see these tables:
- `users` - User management
- `attendance` - Attendance tracking
- `leaves` - Leave management
- `tasks` - Task management
- `notices` - Notice management

## 🔐 Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@worknest.com | admin123 |
| Staff | staff@worknest.com | staff123 |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/change-password` - Change password

### User Management
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Health & Testing
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

### File Upload
- `POST /api/upload` - Upload file (requires auth)

## 🛠️ Development

### Project Structure
```
backend/
├── config/
│   └── database.js      # Database configuration
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── attendance.js    # Attendance routes
│   ├── leaves.js        # Leave management routes
│   ├── tasks.js         # Task management routes
│   ├── notices.js       # Notice management routes
│   └── reports.js       # Reports routes
├── setup/
│   └── database.js      # Database setup script
├── uploads/             # File upload directory
├── server.js            # Main server file
├── package.json
└── README.md
```

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Setup database tables and sample data

## 🔧 Configuration

### Database Configuration
The database connection is configured in `config/database.js`:
- Connection pooling
- Error handling
- Connection testing

### Authentication
JWT-based authentication with:
- Token expiration (24h default)
- Role-based access control
- Password hashing with bcrypt

### File Upload
- Multer configuration
- 5MB file size limit
- Unique filename generation
- Static file serving

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "status": "error_type"
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention

## 📝 API Response Format

All successful responses follow this format:
```json
{
  "message": "Success message",
  "data": {},
  "pagination": {} // if applicable
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill process using port 5000

3. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Ensure token format: `Bearer <token>`

### Debug Mode
Enable detailed logging by setting in `.env`:
```env
NODE_ENV=development
```

## 📚 Next Steps

1. **Complete Route Implementation**
   - Implement attendance routes
   - Implement leave management
   - Implement task management
   - Implement notice management
   - Implement reports

2. **Frontend Integration**
   - Connect React frontend
   - Handle authentication
   - Implement API calls

3. **Production Deployment**
   - Environment configuration
   - Database optimization
   - Security hardening

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 