# Deployment Guide

Complete guide for deploying MyExam projects to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Git repository is clean

## Environment Preparation

### 1. Update Environment Variables

Create `.env.production`:

```
NODE_ENV=production
APP_PORT=5000
CLIENT_URL=https://your-domain.com
APP_URL=https://api.your-domain.com

# Database (use managed service in production)
DB_TYPE=mongodb
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Security
JWT_SECRET=<generate-long-random-string>
JWT_EXPIRE=7d

# Email Service
SMTP_HOST=<email-service>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<password>

# Logging
LOG_LEVEL=error
LOG_FILE=/var/log/myexam/app.log
```

### 2. Build Project

```bash
# Build frontend
cd frontend
npm run build

# Build backend (if needed)
cd ../backend
npm run build
```

## Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Initialize Heroku app**
```bash
heroku login
heroku create your-app-name
```

2. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set MONGO_URI=<your-mongo-uri>
```

3. **Deploy**
```bash
git push heroku main
```

4. **View logs**
```bash
heroku logs --tail
```

### Option 2: AWS Deployment

#### Using EC2

1. **Launch EC2 instance**
   - Ubuntu 20.04 LTS
   - t3.micro or larger
   - Security group: allow ports 22, 80, 443

2. **Connect and setup**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <your-repo>
cd your-project
```

3. **Setup PM2**
```bash
# Create PM2 configuration
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: "backend",
      script: "./backend/dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy**
```bash
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/default

# Add:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: DigitalOcean App Platform

1. **Connect repository**
   - Link your GitHub account
   - Select repository

2. **Configure app**
   - Set build command: `npm install && npm run build`
   - Set run command: `npm start`

3. **Set environment variables**
   - Add via DigitalOcean dashboard

4. **Deploy**
   - Push to main branch
   - DigitalOcean automatically deploys

### Option 4: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY backend ./backend
COPY frontend ./frontend

EXPOSE 5000 3000

CMD ["node", "backend/dist/index.js"]
```

2. **Build and run**
```bash
docker build -t myexam:latest .
docker run -p 5000:5000 -e NODE_ENV=production myexam:latest
```

3. **Deploy to container registry**
```bash
# Docker Hub
docker tag myexam:latest your-username/myexam:latest
docker push your-username/myexam:latest

# Deploy to any cloud platform supporting Docker
```

## Database Migration

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Create database user
4. Use connection string in MONGO_URI

### MySQL on AWS RDS

1. Create RDS instance
2. Configure security group
3. Get endpoint
4. Update DB credentials

## Production Considerations

### Security

- [ ] Use HTTPS (SSL/TLS)
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security audits
- [ ] CORS properly configured
- [ ] Input validation on all endpoints

### Performance

- [ ] Enable gzip compression
- [ ] Use CDN for static files
- [ ] Database connection pooling
- [ ] Caching strategy
- [ ] Load balancing if needed
- [ ] Monitor performance metrics

### Monitoring & Logging

```bash
# Install monitoring tools
npm install winston
npm install @sentry/node

# Setup error tracking
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Backup Strategy

- Daily database backups
- Version control for code
- Document disaster recovery plan
- Test restore procedures

## Post-Deployment

### Verification

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# View logs
pm2 logs

# Check database connection
# Test all critical features
```

### Monitoring Setup

1. Setup uptime monitoring (Uptime Robot, Pingdom)
2. Setup error tracking (Sentry, Rollbar)
3. Setup performance monitoring (New Relic, DataDog)
4. Setup log aggregation (ELK Stack, LogRocket)

### Maintenance

- Regular security updates
- Database optimization
- Performance tuning
- Documentation updates

## Scaling

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Better database hardware

### Horizontal Scaling
- Add load balancer
- Multiple app instances
- Database replication
- Cache layer (Redis)

## Troubleshooting

### App crashes on startup
```bash
pm2 logs
# Check environment variables
# Verify database connection
```

### High memory usage
```bash
pm2 monit
# Identify memory leaks
# Implement caching
```

### Database connection errors
```bash
# Check connection string
# Verify firewall rules
# Check database status
```

## Rollback Procedure

```bash
# If deployment fails
git revert <commit-hash>
git push

# PM2 will auto-restart with new code
pm2 reload all
```

## Cost Optimization

- Use spot instances for development
- Auto-scaling policies
- Right-size database instances
- Use CDN for static content
- Implement caching

## Security Hardening

```bash
# Update all packages
npm audit fix

# Use security middleware
npm install helmet

# Rate limiting
npm install express-rate-limit

# Input validation
npm install joi

# CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL
}));
```

## CI/CD Setup (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
      
      - name: Deploy to production
        run: npm run deploy
```

## Support

For deployment issues:
1. Check logs carefully
2. Review environment variables
3. Verify connectivity
4. Check firewall rules
5. Contact hosting provider support

---

Happy deploying! 🚀
