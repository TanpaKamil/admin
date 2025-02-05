# API Documentation for Web App

## Base URL
All API requests should be made to:

http://localhost:3000/api


## Authentication API
### 1. Login
POST /api/auth/login


**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
**Respons success:**
```json
{
  "message": "Login successful",
  "token": "your_jwt_token"
}
```
## User Management API
### 2. Fetch All Users
GET /api/users

**Respons success:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active",
      "modules": [101, 102]
    }
  ]
}
```
## 3. Fetch a Single User
GET /api/users/{id}

**Respons success:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "status": "active",
  "modules": [101, 102]
}
```
## 4. Update User Status (Activate/Deactivate)
PATCH /api/users/{id}

**Request body:**
```json
{
  "status": "unactive"
}
```

**Respons success:**
```json
{
  "message": "User status updated",
  "user": {
    "id": 1,
    "status": "unactive"
  }
}
```

## Module Management API
### 5. Fetch All Modules
GET /api/modules

**Respons:**
```json
{
  "modules": [
    {
      "id": 101,
      "name": "Frontend Basics",
      "status": "active",
      "users": [1, 2],
      "recommended": false,
      "documents": []
    }
  ]
}
```
### 6. Fetch a Single Module
GET /api/modules/{id}

**Respons:**

```json
{
  "id": 101,
  "name": "Frontend Basics",
  "status": "active",
  "users": [1, 2],
  "recommended": false,
  "documents": [
    {
      "fileName": "HTML & CSS Basics.pdf",
      "fileSize": 420345,
      "status": "completed",
      "result": {
        "summaries": ["Introduction to HTML", "CSS Styling Basics"],
        "keyConcepts": ["HTML tags", "CSS Selectors", "Box Model"],
        "exercises": ["Create a webpage using HTML", "Style it using CSS"]
      },
      "createdAt": "2025-01-27T16:33:26.999Z",
      "updatedAt": "2025-01-27T16:35:45.234Z"
    }
  ]
}
```

## Document Management API

### 9. Fetch All Documents in a Module
GET /api/modules/{id}/documents

**Respons:**
```json
{
  "documents": [
    {
      "fileName": "HTML & CSS Basics.pdf",
      "fileSize": 420345,
      "status": "completed",
      "result": {
        "summaries": ["Introduction to HTML", "CSS Styling Basics"],
        "keyConcepts": ["HTML tags", "CSS Selectors", "Box Model"],
        "exercises": ["Create a webpage using HTML", "Style it using CSS"]
      },
      "createdAt": "2025-01-27T16:33:26.999Z",
      "updatedAt": "2025-01-27T16:35:45.234Z"
    }
  ]
}
```

Status Code	Meaning
200 OK	Successful request
201 Created	Resource created successfully
400 Bad Request	Invalid request parameters
401 Unauthorized	Authentication failed
403 Forbidden	User does not have permission
404 Not Found	Resource not found
500 Internal Server Error	Server encountered an error