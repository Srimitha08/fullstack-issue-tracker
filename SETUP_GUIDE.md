# MERN Issue Tracking System - Setup Guide

## Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB Atlas account
- Git

### Step-by-Step Setup

#### 1. Clone/Extract Project
```bash
# Extract to your workspace
cd c:\Users\SRIMITHA\Desktop\Fullstack
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Check that .env file exists with:
# - MONGODB_URI (MongoDB Atlas connection string)
# - JWT_SECRET (any secret key)
# - External API credentials

# Verify .env content:
cat .env

# Start the server
npm start
# Server will run on http://localhost:5000
```

#### 3. Frontend Setup (in new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Verify .env file exists with:
# REACT_APP_API_URL=http://localhost:5000/api

# Start React app
npm start
# App will open at http://localhost:3000
```

### Initial Login

Use these test credentials after seeding the database:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager@example.com`
- Password: `manager123`

**Developer Account:**
- Email: `dev1@example.com`
- Password: `dev123`

**Tester Account:**
- Email: `tester@example.com`
- Password: `test123`

### Database Seeding (Optional)

To seed sample data:

```bash
cd backend

# Run seed script
npm run seed

# This creates sample users, projects, and issues
```

---

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/issue-tracking
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EXTERNAL_API_URL=https://t4e-testserver.onrender.com/api
EXTERNAL_API_USER=SRIMITHA R
EXTERNAL_API_PASSWORD=130307
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Project File Structure

```
Fullstack/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Issue.js
│   │   ├── Comment.js
│   │   └── ActivityLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── issueController.js
│   │   ├── commentController.js
│   │   ├── syncController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── issueRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── syncRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── externalApi.js
│   │   └── helpers.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── UsersPage.js
│   │   │   ├── ProjectsPage.js
│   │   │   ├── IssuesPage.js
│   │   │   └── ProfilePage.js
│   │   ├── context/
│   │   │   └── AppContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Features Implemented

### ✅ Section A: Authentication & Authorization
- [x] User registration with validation
- [x] Login with JWT token generation
- [x] Current user API (protected)
- [x] Role-based authorization (admin, manager, developer, tester)
- [x] Password hashing with bcryptjs
- [x] Duplicate email prevention

### ✅ Section B: Dataset Synchronization
- [x] Sync API to fetch from external API
- [x] Data validation and sanitization
- [x] Duplicate prevention
- [x] Health check endpoint

### ✅ Section C: MongoDB Persistence
- [x] User collection with relationships
- [x] Project collection with owner/members
- [x] Issue collection with project/user relationships
- [x] Comment collection with issue/user relationships
- [x] ActivityLog collection

### ✅ Section D: CRUD & Workflow APIs
- [x] User APIs (GET)
- [x] Project CRUD (POST, GET, PATCH, DELETE)
- [x] Issue CRUD (POST, GET, PATCH, DELETE)
- [x] Comment CRUD (POST, GET, DELETE)
- [x] Workflow validation rules

### ✅ Section E: Issue Workflow APIs
- [x] Assign issue (admin/manager only)
- [x] Update issue status with workflow rules
- [x] Status validation (open, in progress, testing, resolved, closed)
- [x] Workflow restrictions

### ✅ Section F: Filtering, Search & Pagination
- [x] Issue filters (status, priority, severity)
- [x] Project filters (status, owner)
- [x] Pagination with page/limit
- [x] Search by title/keyword

### ✅ Section G: Analytics & Aggregation
- [x] Issue analytics (counts by status)
- [x] Project analytics (counts and project-wise issues)
- [x] Developer analytics (assigned, resolved, resolution time)

### ✅ Section H: Frontend Integration
- [x] React login page
- [x] JWT token handling
- [x] Protected routes
- [x] Role-based rendering
- [x] Dashboard with analytics
- [x] User management
- [x] Project management
- [x] Issue management

### ✅ Section I: Frontend Architecture
- [x] Context API with useReducer
- [x] Global state management
- [x] Protected routes
- [x] Role-based navigation
- [x] Data-testid attributes on all major components
- [x] Dynamic UI based on state

### ✅ Section J: Frontend Evaluator Compliance
- [x] window.appState exposure
- [x] State structure with all required fields
- [x] Dynamic state updates
- [x] JWT token persistence
- [x] Session maintenance
- [x] Unauthorized route restriction
- [x] Role-based UI rendering
- [x] Required routes (/login, /dashboard, /users, /projects, /issues, /profile)

---

## Common Tasks

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER123",
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "developer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Create a Project (with token)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Project",
    "description": "Project description"
  }'
```

### Create an Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Bug Title",
    "description": "Bug description",
    "projectId": "PROJECT_MONGODB_ID",
    "priority": "high",
    "severity": "critical"
  }'
```

---

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI in .env is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database name is correct

### CORS Errors
- Ensure backend has CORS enabled (it does)
- Check that frontend is running on port 3000
- Verify REACT_APP_API_URL in frontend .env

### JWT Token Errors
- Token may be expired (set to 7 days)
- Clear localStorage and re-login
- Check JWT_SECRET in backend .env

### Port Already in Use
- Change PORT in backend .env to available port
- Change port in frontend .env accordingly

### Module Not Found Errors
- Run `npm install` in both backend and frontend
- Delete node_modules and run npm install again
- Check that all packages are listed in package.json

---

## Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Navigate to dashboard (verify analytics load)
- [ ] Create a project (admin/manager)
- [ ] Create an issue
- [ ] Assign issue (admin/manager only)
- [ ] Update issue status
- [ ] Add comment to issue
- [ ] View all issues with filters
- [ ] View user profile
- [ ] Logout and verify redirect to login

### Automated Testing

The application includes `data-testid` attributes for Playwright testing:

```javascript
// Example Playwright test
await page.click('[data-testid="login-email"]');
await page.fill('[data-testid="login-email"]', 'admin@example.com');
await page.click('[data-testid="login-password"]');
await page.fill('[data-testid="login-password"]', 'admin123');
await page.click('[data-testid="login-submit"]');
```

---

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=https://your-backend.herokuapp.com/api
```

---

## Support & Documentation

- See [README.md](README.md) for general overview
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API reference
- Backend routes are in `backend/routes/`
- Frontend components are in `frontend/src/components/`
- Context API setup in `frontend/src/context/AppContext.js`
