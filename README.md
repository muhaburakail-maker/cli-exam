# create-my-exam - Production-Ready CLI Framework

Build complete applications in seconds with create-my-exam's powerful CLI tool.

## Features

✨ **Production-Ready Templates** - Carefully designed templates for various applications
🚀 **Quick Setup** - Create projects with a single command
🛠 **Flexible Configuration** - Choose your database and tech stack
📦 **Package Management** - Automatic dependency installation
🔄 **Import/Merge** - Integrate framework into existing projects
🎨 **Modern Stack** - React, Vite, Express, MongoDB/MySQL

## Installation

```bash
npm install -g create-my-exam
```

## Quick Start

```bash
npx create-my-exam@latest
```

## Templates

create-my-exam provides multiple production-ready templates:

- **Rwanda National Exam Practice** - Complete exam platform with analytics
- **CBT Examination System** - Computer-based testing platform
- **School Management System** - Full school administration
- **E-commerce Platform** - Complete shopping solution
- **Investment Platform** - Portfolio and investment tracking
- **Order Grabbing Platform** - Delivery and order management
- **Hotel Management System** - Booking and reservation system
- **Hospital Management System** - Healthcare management

## Technology Stack

### Frontend
- React 18+
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express
- JWT Authentication
- REST API

### Database
- MongoDB (NoSQL)
- MySQL (SQL)

## Usage

### Create New Project

```bash
npx create-my-exam@latest
```

Follow the interactive wizard to:
1. Choose action (Create New or Import)
2. Select template
3. Choose database
4. Configure environment
5. Install dependencies

### Import into Existing Project

```bash
npx create-my-exam@latest
# Select "Import Framework Into Existing Project"
```

Choose between:
- **Merge Mode**: Keep existing files and add framework
- **Replace Mode**: Backup and replace with framework

## Project Structure

```
my-exam-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── docs/
├── .env
├── INSTALLATION_REPORT.md
└── package.json
```

## Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Opens two terminals:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Configuration

### Environment Variables

Create `.env` in backend directory:

```
NODE_ENV=development
APP_PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=my-exam
MONGO_URI=mongodb://localhost:27017/my-exam

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### Database Setup

#### MongoDB
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGO_URI in .env
```

#### MySQL
```bash
# Create database
CREATE DATABASE my_exam;

# Update .env with credentials
DB_USERNAME=root
DB_PASSWORD=your-password
```

## Commands

### Global Commands

```bash
# Create new project
npx create-my-exam@latest

# With specific options
npx create-my-exam@latest my-project --template rwanda-exam --database mongodb

# Skip npm install
npx create-my-exam@latest --skip-install

# Force overwrite existing directory
npx create-my-exam@latest my-project --force
```

### Development Commands

```bash
# Run full development environment
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Troubleshooting

### npm install fails

1. Ensure Node.js 14+ is installed
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules`
4. Try installing again: `npm install`

### Port already in use

Change the port in .env or package.json:
```
APP_PORT=5001
CLIENT_PORT=3001
```

### Database connection fails

1. Ensure database is running
2. Check credentials in .env
3. Verify host and port are correct
4. Check firewall settings

### Template download fails

1. Check internet connection
2. Verify GitHub is accessible
3. Check GitHub rate limits (unauthenticated: 60 req/hour)
4. Try again later

## Contributing

We welcome contributions! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For help and support:

1. Check documentation in `docs/` folder
2. Review template README files
3. Open an issue on GitHub
4. Contact: muhaburakail@gmail.com

## Roadmap

- [ ] Visual project builder UI
- [ ] More templates and integrations
- [ ] Plugin system for extensions
- [ ] Cloud deployment integration
- [ ] Multi-language support
- [ ] GraphQL support

## Changelog

### v1.0.0 (Initial Release)
- Initial CLI framework
- 8 production templates
- Database selection (MongoDB/MySQL)
- Merge and Replace engines
- Full setup wizard

## Acknowledgments

Inspired by:
- Create Vite
- Create Next App
- Create T3 App

---

Made with ❤️ by create-my-exam Team

**Happy coding! 🚀**
