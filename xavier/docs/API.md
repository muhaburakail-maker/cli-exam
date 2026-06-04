# API Documentation

## Base URL

`http://localhost:5000/api`

## Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Authentication

#### Login

```
POST /auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "status": 400,
    "message": "Error message"
  }
}
```

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```
