# Database Schema Documentation

## Database: mongodb

## Collections

### User

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required)",
  "role": "String (admin, student, teacher)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### Exam

```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "description": "String",
  "questions": "[ObjectId]",
  "duration": "Number (minutes)",
  "passingScore": "Number",
  "createdBy": "ObjectId (User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Question

```json
{
  "_id": "ObjectId",
  "examId": "ObjectId",
  "text": "String (required)",
  "type": "String (multiple-choice, essay, etc)",
  "options": "[String]",
  "correctAnswer": "String/Number",
  "points": "Number",
  "order": "Number"
}
```

### Result

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "examId": "ObjectId",
  "score": "Number",
  "answers": "Object",
  "startedAt": "Date",
  "completedAt": "Date",
  "status": "String (completed, pending)"
}
```

