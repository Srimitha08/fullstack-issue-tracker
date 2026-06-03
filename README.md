# MERN Issue/Bug Tracking Management System

A comprehensive full-stack application for managing issues, bugs, projects, and team collaboration with authentication, authorization, analytics, and more.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Developer, Tester)
- Password hashing with bcryptjs
- Protected API endpoints

### Core Features
- **User Management**: Register, login, user profiles
- **Project Management**: Create, update, delete projects with team members
- **Issue Tracking**: Create, assign, and track issues/bugs
- **Comments**: Add comments to issues for collaboration
- **Activity Logging**: Track all changes and activities
- **Analytics Dashboard**: Issue and project statistics, developer performance metrics

### Data Features
- MongoDB Atlas integration for persistence
- Data validation and sanitization
- External API data synchronization
- Relationship modeling (User, Project, Issue, Comment, ActivityLog)

### Frontend
- React with Context API for state management
- React Router for navigation
- Protected routes with role-based rendering
- Responsive UI with data-testid attributes for automated testing
- Global state exposure (window.appState) for evaluator compatibility

## Project Structure

```
backend/
├── models/          # MongoDB schemas
├── controllers/     # API logic
├── routes/          # API endpoints
├── middleware/      # Auth, validation
├── utils/           # Helper functions
├── server.js        # Express app entry point
├── package.json
└── .env

frontend/
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── context/      # Context API state
│   ├── utils/        # API utilities
│   ├── App.js        # Main app component
│   └── index.js      # Entry point
├── public/
│   └── index.html
├── package.json
└── .env
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account and connection URI

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (already provided) with your MongoDB URI and configuration:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   EXTERNAL_API_URL=https://t4e-testserver.onrender.com/api
   EXTERNAL_API_USER=SRIMITHA R
   EXTERNAL_API_PASSWORD=130307
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (already provided):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

### Projects
- `POST /api/projects` - Create project (admin/manager only)
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `PATCH /api/projects/:id` - Update project (admin/manager only)
- `DELETE /api/projects/:id` - Delete project (admin/manager only)

### Issues
- `POST /api/issues` - Create issue (protected)
- `GET /api/issues` - Get all issues with filters (protected)
- `GET /api/issues/:id` - Get issue by ID (protected)
- `PATCH /api/issues/:id` - Update issue (protected)
- `DELETE /api/issues/:id` - Delete issue (protected)
- `PATCH /api/issues/:id/assign` - Assign issue (admin/manager only)
- `PATCH /api/issues/:id/status` - Update issue status (protected)

### Comments
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments` - Get all comments (protected)
- `GET /api/comments/:issueId` - Get comments for issue (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Analytics
- `GET /api/analytics/issues` - Issue statistics (admin/manager only)
- `GET /api/analytics/projects` - Project statistics (admin/manager only)
- `GET /api/analytics/developers` - Developer statistics (admin/manager only)

### Data Sync
- `POST /api/sync` - Sync external dataset (admin/manager only)
- `GET /api/sync/health` - Health check

## Frontend Routes

- `/login` - Login page
- `/dashboard` - Analytics dashboard
- `/users` - User management (admin/manager)
- `/projects` - Project management
- `/issues` - Issue management
- `/profile` - User profile

## Global State (window.appState)

The frontend exposes the application state via `window.appState` for automated evaluation:

```javascript
window.appState = {
  authUser,      // Current authenticated user
  token,         // JWT token
  users,         // List of users
  projects,      // List of projects
  issues,        // List of issues
  comments,      // List of comments
  filters,       // Current filters
  analytics      // Analytics data
}
```

## Key Features Implementation

### Authentication Flow
1. User registers/logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage and global state
4. Token included in all subsequent API requests
5. Token verified by auth middleware on protected routes

### Authorization
Role-based access control:
- **Admin**: Full access to all features
- **Manager**: Can create/assign projects and issues, access analytics
- **Developer**: Can update assigned issues, change status, add comments
- **Tester**: Can report bugs, add comments

### Data Validation
- Email format validation
- Password strength requirements
- Priority/Severity/Status enum validation
- Date validation for issue due dates
- Duplicate prevention (email, issue titles in projects)

### State Management
- Context API with useReducer for global state
- Action dispatchers for state updates
- Persistent token in localStorage
- State exposed via window.appState for testing

### Protected Routes
- Routes protected by authentication
- Role-based route rendering
- Automatic redirect to login for unauthorized users
- Dynamic navigation based on user role

## Testing with Playwright

The application includes data-testid attributes on all major components for automated Playwright testing:

- `data-testid="login-page"`
- `data-testid="dashboard-page"`
- `data-testid="navigation"`
- `data-testid="issues-page"`
- `data-testid="projects-page"`
- And many more...

## Development Notes

### Standard Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "data": {}
}
```

### Database Connection

Uses MongoDB Atlas with connection URI in .env file. Collections:
- users
- projects
- issues
- comments
- activitylogs

### Frontend State Updates

Components use Context API to:
1. Fetch data from APIs
2. Dispatch actions to update global state
3. Render UI based on state
4. Handle loading/error states

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB URI is correct in .env
- Check that JWT_SECRET is set
- Verify port 5000 is not in use

### Frontend API Errors
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Verify token is being sent in Authorization header

### CORS Issues
- Backend has CORS enabled for localhost:3000
- Check that frontend is on correct port

## Deployment

### Backend
- Can be deployed to Heroku, AWS, DigitalOcean, etc.
- Environment variables must be set on deployment platform
- Ensure MongoDB URI is accessible from deployment server

### Frontend
- Build with `npm run build`
- Deploy to Vercel, Netlify, GitHub Pages, etc.
- Update REACT_APP_API_URL to point to production backend

## Author

Created for MERN Full Stack Assessment

## License

ISC
