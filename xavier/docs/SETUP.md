# Setup Guide

## Prerequisites

- Node.js 14+
- npm or yarn
- MongoDB Server

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file in backend directory:

```
NODE_ENV=development
APP_PORT=5000
CLIENT_URL=http://localhost:3000

DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
MONGO_URI=mongodb://localhost:27017/my-exam

JWT_SECRET=your-secret-key
```

### 3. Start Database

```bash
mongod
```

### 4. Start Development Servers

Frontend:
```bash
cd frontend
npm run dev
```

Backend (in another terminal):
```bash
cd backend
npm run dev
```

### 5. Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Troubleshooting

### Port Already in Use

Change PORT in .env and vite.config.js

### Database Connection Error

1. Ensure database is running
2. Check connection credentials in .env
3. Verify firewall allows connections

### Dependencies Installation Error

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
