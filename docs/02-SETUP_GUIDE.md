# LearnHub LMS - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
2. **npm** (v9.0 or higher) - Comes with Node.js
3. **Git** - [Download](https://git-scm.com/)
4. **PostgreSQL** (v14 or higher) OR a cloud PostgreSQL instance
5. **Cloudinary Account** - Free tier available at [cloudinary.com](https://cloudinary.com)

### Verify Installation
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
git --version     # Any recent version
```

---

## Step 1: Project Setup

### 1.1 Clone the Repository
```bash
git clone <repository-url>
cd LMS
```

### 1.2 Install Dependencies
The project uses a monorepo structure. Install all dependencies:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install
cd ..

# Install client dependencies
cd client && npm install
cd ..
```

Or use the provided script:
```bash
npm run install:all
```

---

## Step 2: Database Setup

### 2.1 Option A: Local PostgreSQL

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

#### Create Database
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lms_db;

# Exit
\q
```

### 2.2 Option B: Cloud PostgreSQL (Render/Railway)

1. Sign up at [render.com](https://render.com) or [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string (DATABASE_URL)

---

## Step 3: Environment Configuration

### 3.1 Server Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux
```

Edit `server/.env` with your values:

```env
# Database Connection (Replace with your credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
# OR for cloud:
# DATABASE_URL="postgresql://user:pass@host:5432/database"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# Cloudinary Configuration (Get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3.2 Client Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd client
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

---

## Step 4: Database Migration & Seeding

### 4.1 Run Prisma Migrations
```bash
cd server
npx prisma migrate dev --name init
```

This will:
- Create database tables
- Set up the schema
- Generate Prisma client

### 4.2 Seed the Database
Populate the database with sample data:

```bash
# From the root directory
npm run seed

# Or from server directory
npx prisma db seed
```

This creates:
- Admin user: admin@lms.com / admin123
- Instructor: instructor@lms.com / instructor123
- Students: student1@lms.com / student123

---

## Step 5: Running the Application

### 5.1 Development Mode (Recommended)

Run both client and server simultaneously:

```bash
# From root directory
npm run dev
```

This starts:
- Server at http://localhost:5000
- Client at http://localhost:5173

### 5.2 Run Separately

Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

### 5.3 Production Mode

Build the client:
```bash
cd client
npm run build
```

Start the server:
```bash
cd server
npm start
```

---

## Step 6: Verify Installation

### 6.1 Health Check
Open browser and navigate to:
- http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-02T...",
  "uptime": 123.45,
  "environment": "development"
}
```

### 6.2 Client Access
- Open http://localhost:5173
- You should see the LearnHub homepage

### 6.3 Test Login
- Admin: admin@lms.com / admin123
- Instructor: instructor@lms.com / instructor123
- Student: student1@lms.com / student123

---

## Common Issues & Troubleshooting

### Issue 1: DATABASE_URL not found
**Error**: `Environment variable not found: DATABASE_URL`

**Solution**:
```bash
# Ensure .env file exists in server directory
cd server
ls -la .env  # Should show the file

# If missing, create it
copy .env.example .env
# Edit with your database URL
```

### Issue 2: Prisma Client not generated
**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd server
npx prisma generate
```

### Issue 3: Port already in use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue 4: CORS errors in browser
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Ensure `CLIENT_URL` in server `.env` matches client URL
- Default: http://localhost:5173

### Issue 5: Cloudinary upload fails
**Error**: `Cloudinary upload failed`

**Solution**:
- Verify Cloudinary credentials in `.env`
- Check cloud name, API key, and API secret
- Ensure Cloudinary account is active

### Issue 6: JWT errors
**Error**: `invalid signature` or `jwt expired`

**Solution**:
```bash
# Clear localStorage in browser
localStorage.clear()
# Refresh and login again
```

---

## Directory Structure After Setup

```
LMS/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── api/              # API configuration
│   │   └── services/         # Socket.io service
│   ├── public/               # Static assets
│   └── .env                  # Client environment
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, error handlers
│   │   ├── config/           # Prisma, Socket
│   │   └── index.js          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seed data
│   └── .env                  # Server environment
│
├── docs/                      # Documentation
├── package.json               # Root package.json
└── README.md                  # Project readme
```

---

## Additional Configuration

### Configure Rate Limiting
Edit `server/src/index.js`:
```javascript
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
});
```

### Change Default Port
Edit `server/.env`:
```env
PORT=3000  # Change to your preferred port
```

Update `client/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Next Steps

After successful setup:

1. **Login as Admin** - Access admin dashboard at `/admin`
2. **Create Categories** - Add course categories (if implemented)
3. **Register Instructors** - Create instructor accounts
4. **Create Courses** - Start adding courses
5. **Test Enrollment** - Enroll students and track progress

---

## Support & Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Express Docs**: https://expressjs.com/en/guide/routing.html
- **React Docs**: https://react.dev/
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Setup Guide Version**: 1.0
**Last Updated**: May 2026
