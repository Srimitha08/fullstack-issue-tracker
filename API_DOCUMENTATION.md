# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    // Response data varies by endpoint
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
- **URL:** `POST /auth/register`
- **Auth:** No
- **Body:**
```json
{
  "userId": "USER001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "developer",
  "department": "Engineering"
}
```
- **Response:** User object with JWT token

### Login
- **URL:** `POST /auth/login`
- **Auth:** No
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** User object with JWT token

### Get Current User
- **URL:** `GET /auth/me`
- **Auth:** Yes (Required)
- **Response:** Current authenticated user object

---

## User Endpoints

### Get All Users
- **URL:** `GET /users`
- **Auth:** Yes (Required)
- **Query Params:** None
- **Response:** Array of user objects

### Get User by ID
- **URL:** `GET /users/:id`
- **Auth:** Yes (Required)
- **Params:** User MongoDB ID
- **Response:** Single user object

---

## Project Endpoints

### Create Project
- **URL:** `POST /projects`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Body:**
```json
{
  "title": "Project Name",
  "description": "Project description",
  "startDate": "2024-01-01"
}
```
- **Response:** Created project object

### Get All Projects
- **URL:** `GET /projects`
- **Auth:** Yes (Required)
- **Query Params:**
  - `status` - Filter by status (active, inactive, closed)
  - `owner` - Filter by owner userId
  - `page` - Pagination page (default: 1)
  - `limit` - Items per page (default: 10)
  - `search` - Search by title
- **Example:** `GET /projects?status=active&page=1&limit=10`
- **Response:** Array of projects with pagination info

### Get Project by ID
- **URL:** `GET /projects/:id`
- **Auth:** Yes (Required)
- **Params:** Project MongoDB ID
- **Response:** Single project object

### Update Project
- **URL:** `PATCH /projects/:id`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active",
  "members": ["userId1", "userId2"]
}
```
- **Response:** Updated project object

### Delete Project
- **URL:** `DELETE /projects/:id`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Response:** Deleted project object

---

## Issue Endpoints

### Create Issue
- **URL:** `POST /issues`
- **Auth:** Yes (Required)
- **Body:**
```json
{
  "title": "Issue Title",
  "description": "Issue description",
  "projectId": "PROJECT_MONGODB_ID",
  "priority": "high",
  "severity": "critical",
  "dueDate": "2024-03-15"
}
```
- **Valid Priorities:** low, medium, high, critical
- **Valid Severities:** low, medium, high, critical
- **Response:** Created issue object

### Get All Issues
- **URL:** `GET /issues`
- **Auth:** Yes (Required)
- **Query Params:**
  - `status` - Filter by status (open, in progress, testing, resolved, closed)
  - `priority` - Filter by priority (low, medium, high, critical)
  - `severity` - Filter by severity
  - `page` - Pagination page
  - `limit` - Items per page
  - `search` - Search by title
- **Example:** `GET /issues?status=open&priority=high&page=1&limit=10`
- **Response:** Array of issues with pagination

### Get Issue by ID
- **URL:** `GET /issues/:id`
- **Auth:** Yes (Required)
- **Params:** Issue MongoDB ID
- **Response:** Single issue object

### Update Issue
- **URL:** `PATCH /issues/:id`
- **Auth:** Yes (Required)
- **Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "severity": "high",
  "dueDate": "2024-03-20"
}
```
- **Response:** Updated issue object

### Delete Issue
- **URL:** `DELETE /issues/:id`
- **Auth:** Yes (Required)
- **Response:** Deleted issue object

### Assign Issue
- **URL:** `PATCH /issues/:id/assign`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Body:**
```json
{
  "assignedToId": "USER_MONGODB_ID"
}
```
- **Response:** Updated issue object with assignment

### Update Issue Status
- **URL:** `PATCH /issues/:id/status`
- **Auth:** Yes (Required)
- **Body:**
```json
{
  "status": "in progress"
}
```
- **Valid Statuses:** open, in progress, testing, resolved, closed
- **Workflow Rules:**
  - Closed issues cannot be reopened
  - Resolved issues cannot be edited directly
  - Only assigned developer can move to testing
  - Testers cannot close issues directly
- **Response:** Updated issue object

---

## Comment Endpoints

### Create Comment
- **URL:** `POST /comments`
- **Auth:** Yes (Required)
- **Body:**
```json
{
  "message": "Comment text",
  "issueId": "ISSUE_MONGODB_ID"
}
```
- **Response:** Created comment object

### Get All Comments
- **URL:** `GET /comments`
- **Auth:** Yes (Required)
- **Response:** Array of comment objects

### Get Comments for Issue
- **URL:** `GET /comments/:issueId`
- **Auth:** Yes (Required)
- **Params:** Issue MongoDB ID
- **Response:** Array of comments for that issue

### Delete Comment
- **URL:** `DELETE /comments/:id`
- **Auth:** Yes (Required)
- **Params:** Comment MongoDB ID
- **Response:** Deleted comment object

---

## Analytics Endpoints

### Issue Analytics
- **URL:** `GET /analytics/issues`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Response:**
```json
{
  "totalIssues": 10,
  "openIssues": 3,
  "resolvedIssues": 5,
  "closedIssues": 2,
  "inProgressIssues": 4,
  "testingIssues": 1
}
```

### Project Analytics
- **URL:** `GET /analytics/projects`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Response:**
```json
{
  "totalProjects": 5,
  "activeProjects": 3,
  "inactiveProjects": 1,
  "closedProjects": 1,
  "projectWiseIssueCount": [
    {
      "projectId": "PRJ001",
      "projectName": "Project Name",
      "issueCount": 10
    }
  ]
}
```

### Developer Analytics
- **URL:** `GET /analytics/developers`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Response:**
```json
{
  "developerStats": [
    {
      "developerId": "DEV_ID",
      "name": "Developer Name",
      "email": "dev@example.com",
      "assignedIssues": 5,
      "resolvedIssues": 3,
      "averageResolutionTimeHours": "24.50"
    }
  ]
}
```

---

## Data Sync Endpoints

### Sync External Dataset
- **URL:** `POST /sync`
- **Auth:** Yes (Required)
- **Roles:** admin, manager
- **Body:** None (uses credentials from .env)
- **Response:**
```json
{
  "syncSummary": {
    "totalRecords": 100,
    "validRecords": 95,
    "invalidRecords": 3,
    "duplicates": 2,
    "errors": ["Error message 1", "Error message 2"]
  }
}
```

### Health Check
- **URL:** `GET /sync/health`
- **Auth:** No
- **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "stats": {
    "users": 10,
    "projects": 5,
    "issues": 20
  }
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Workflow Rules

### Issue Assignment
- Only admin/manager can assign issues
- Cannot assign to closed issues
- Assigned user must exist in the system

### Issue Status Changes
- **open** → Can move to: in progress, testing, closed
- **in progress** → Can move to: testing, open, closed
- **testing** → Can move to: resolved, in progress, open
- **resolved** → Cannot be edited directly
- **closed** → Cannot be reopened without special action

### Project Management
- Only admin/manager can create/update/delete projects
- Projects can have multiple members
- Projects have owner and member roles

### User Roles
- **Admin:** Full system access
- **Manager:** Project and issue management, access analytics
- **Developer:** Update assigned issues, change status, add comments
- **Tester:** Report bugs, add comments
