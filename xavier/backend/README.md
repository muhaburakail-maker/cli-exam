# Backend - MyExam

Express.js backend for MyExam platform.

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file:

```
NODE_ENV=development
APP_PORT=5000
JWT_SECRET=your-secret
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

### Testing

```bash
npm test
```

## API Endpoints

See `docs/API.md` for complete API documentation.

## File Structure

- `src/models/` - Database models
- `src/routes/` - API routes
- `src/controllers/` - Business logic
- `src/middleware/` - Express middleware
- `src/config/` - Configuration
- `src/utils/` - Utility functions
