# WorkNest Testing Guide

## Overview
This directory contains comprehensive test suites for the WorkNest Employee Management System, covering both frontend React components and backend API endpoints.

## Test Structure
```
Testing/
├── frontend/           # React component tests
├── backend/           # API and model tests
├── package.json       # Test dependencies
└── setupTests.js      # Test configuration
```

## Frontend Tests
- **AuthContext.test.js**: Authentication context and state management
- **Login.test.js**: Login component functionality and password toggle
- **ProtectedRoute.test.js**: Route protection and role-based access
- **AdminDashboard.test.js**: Dashboard data fetching and display

## Backend Tests
- **auth.test.js**: Authentication endpoints (login, signup, stats)
- **users.test.js**: User management API endpoints
- **models.test.js**: Database model validation and associations

## Running Tests

### Prerequisites
```bash
cd Testing
npm install
```

### Test Commands
```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run only frontend tests
npm run test:frontend

# Run only backend tests
npm run test:backend
```

## Test Coverage
The test suite covers:
- ✅ Authentication flow (login/signup/logout)
- ✅ Route protection and authorization
- ✅ Password visibility toggle
- ✅ Dashboard data fetching
- ✅ API endpoint security
- ✅ Database model validation
- ✅ Error handling and edge cases

## Mock Strategy
- **Frontend**: Mocks AuthContext, fetch API, localStorage
- **Backend**: Mocks Sequelize models and database operations
- **Shared**: Environment variables and browser APIs

## Best Practices
1. Each test file focuses on a single component/module
2. Tests include both positive and negative scenarios
3. Mocks are isolated and reset between tests
4. Error states and edge cases are thoroughly tested
5. Authentication and authorization are validated

## Adding New Tests
When adding new features, ensure to:
1. Create corresponding test files
2. Test both success and failure scenarios
3. Mock external dependencies
4. Update this README if needed
