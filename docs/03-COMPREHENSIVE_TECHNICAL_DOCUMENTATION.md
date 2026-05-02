# LearnHub LMS - Comprehensive Technical Documentation

## Table of Contents
1. [System Requirements](#1-system-requirements)
2. [Technology Stack Deep Dive](#2-technology-stack-deep-dive)
3. [Database Architecture](#3-database-architecture)
4. [API Specifications](#4-api-specifications)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Security Implementation](#7-security-implementation)
8. [Deployment Guide](#8-deployment-guide)

---

## 1. System Requirements

### 1.1 Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Storage | 10 GB | 20 GB |
| Network | 10 Mbps | 100 Mbps |

### 1.2 Software Requirements
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x+ | Runtime environment |
| PostgreSQL | 14.x+ | Primary database |
| npm | 9.x+ | Package management |
| Git | 2.x+ | Version control |

### 1.3 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 2. Technology Stack Deep Dive

### 2.1 Backend Stack

#### Express.js (v4.18.2)
- **Role**: Web application framework
- **Features Used**:
  - Middleware system for request processing
  - Router for API endpoint organization
  - Error handling middleware
  - Static file serving

#### Prisma ORM (v5.10.2)
- **Role**: Database toolkit
- **Components**:
  - `PrismaClient`: Database client with type safety
  - Schema definition in `schema.prisma`
  - Migration system for schema versioning
  - Seed scripts for data population

#### Socket.io (v4.7.0)
- **Role**: Real-time communication
- **Implementation**:
  - Bidirectional event-based communication
  - Room-based notification delivery
  - User connection tracking

#### Additional Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| bcrypt | 5.1.1 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT token generation |
| express-rate-limit | 7.5.1 | Request throttling |
| express-validator | 7.0.0 | Input validation |
| multer | 2.1.1 | File upload handling |
| cloudinary | 1.41.3 | Cloud media storage |
| pdfkit | 0.18.0 | PDF certificate generation |
| cors | 2.8.5 | Cross-origin resource sharing |

### 2.2 Frontend Stack

#### React (v18.2.0)
- **Architecture**: Functional components with hooks
- **State Management**: React Context + useState/useEffect
- **Routing**: React Router DOM v6
- **Features**:
  - Component-based architecture
  - Virtual DOM for efficient rendering
  - Hooks for lifecycle management

#### Vite (v5.1.4)
- **Role**: Build tool and dev server
- **Advantages**:
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules support

#### Tailwind CSS (v3.4.1)
- **Role**: Utility-first CSS framework
- **Features**:
  - Responsive design utilities
  - Dark mode support
  - Custom theme configuration

#### Additional Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| axios | 1.6.7 | HTTP client |
| framer-motion | 11.0.0 | Animations |
| lucide-react | 0.300.0 | Icons |
| react-player | 2.14.0 | Video playback |
| react-toastify | 10.0.0 | Notifications |
| recharts | 2.10.0 | Charts |
| socket.io-client | 4.7.0 | Real-time client |

---

## 3. Database Architecture

### 3.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                    │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | name | email | password | role | isActive | createdAt  │
└─────────────────────────────────────────────────────────────────┘
       │                              │
       │ 1                            │ 1
       │                              │
       ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│      COURSE     │          │   ENROLLMENT    │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ title           │          │ studentId (FK)  │
│ description     │          │ courseId (FK)   │
│ thumbnail       │          │ enrolledAt      │
│ price           │          │ progress        │
│ status          │          └─────────────────┘
│ instructorId(FK)│
└─────────────────┘
       │
       │ 1
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CHAPTER                                  │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | title | videoUrl | duration | order | courseId (FK)    │
└─────────────────────────────────────────────────────────────────┘
       │
       │ 1
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CHAPTER_PROGRESS                              │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | studentId (FK) | chapterId (FK) | watched | watchedAt  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        QUIZ                                     │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | title | courseId (FK) | createdAt                     │
└─────────────────────────────────────────────────────────────────┘
       │
       │ 1
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      QUESTION                                   │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | quizId (FK) | questionText | options | correctAnswer  │
└─────────────────────────────────────────────────────────────────┘
       │
       │ 1
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZ_ATTEMPT                                 │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | studentId (FK) | quizId (FK) | score | attemptedAt    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE                                │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | studentId (FK) | courseId (FK) | issuedAt | certUrl  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     NOTIFICATION                              │
├─────────────────────────────────────────────────────────────────┤
│ id (PK) | userId (FK) | message | isRead | createdAt            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Indexes and Constraints

```prisma
// Unique Constraints
@@unique([email])                    // User email
@@unique([studentId, courseId])      // One enrollment per student/course
@@unique([studentId, chapterId])     // One progress per student/chapter
@@unique([studentId, courseId])      // One certificate per student/course

// Indexes for Performance
@@index([instructorId])              // Course queries by instructor
@@index([courseId])                  // Chapter queries by course
@@index([userId])                    // Notification queries by user
@@index([isRead])                    // Unread notification queries
```

### 3.3 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

---

## 4. API Specifications

### 4.1 Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │ ──────────────────▶│  Server  │ ──────────────────▶│  Database│
│          │  POST /api/auth/login          │  SELECT * FROM users           │
│          │  {email, password}             │  WHERE email = ?               │
│          │◄──────────────────│          │◄──────────────────│          │
│          │  {token, user}                   │  user data                     │
│          │                                  │                                │
│          │ ──────────────────▶│          │  Authorization: Bearer <token> │
│          │  GET /api/courses                │  JWT Verify                    │
│          │◄──────────────────│          │◄─────────────────│          │
│          │  [courses]                       │  decoded.userId                │
└──────────┘                    └──────────┘                    └──────────┘
```

### 4.2 Request/Response Format

#### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

### 4.3 Endpoint Documentation

#### Authentication Endpoints

**POST /api/auth/login**
```
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "STUDENT"
  }
}
```

**POST /api/auth/register**
```
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Course Endpoints

**GET /api/courses**
```
Query Parameters:
- page (optional): Page number
- limit (optional): Items per page
- category (optional): Filter by category
- search (optional): Search in title/description

Response:
{
  "success": true,
  "courses": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

**POST /api/courses** (Instructor only)
```
Request:
{
  "title": "Course Title",
  "description": "Course description",
  "price": 49.99,
  "thumbnail": "image_url",
  "category": "Development"
}

Response:
{
  "success": true,
  "course": {
    "id": "uuid",
    "status": "PENDING",
    "createdAt": "2026-05-02T..."
  }
}
```

#### Quiz Endpoints

**POST /api/courses/:id/quiz** (Instructor)
```
Request:
{
  "title": "Quiz Title"
}

Response:
{
  "success": true,
  "quiz": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Quiz Title"
  }
}
```

**POST /api/quiz/:id/questions** (Instructor)
```
Request:
{
  "questions": [
    {
      "questionText": "What is...?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "0"
    }
  ]
}
```

### 4.4 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_002 | 401 | Token expired |
| AUTH_003 | 403 | Insufficient permissions |
| COURSE_001 | 404 | Course not found |
| COURSE_002 | 400 | Invalid course data |
| ENROLL_001 | 409 | Already enrolled |
| ENROLL_002 | 402 | Payment required |
| VALID_001 | 400 | Validation failed |

---

## 5. Frontend Architecture

### 5.1 Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── Router
│   │   ├── Public Routes
│   │   │   ├── Home
│   │   │   ├── Login
│   │   │   └── Register
│   │   │
│   │   └── Protected Routes (PrivateRoute)
│   │       ├── Student Routes
│   │       │   ├── Dashboard
│   │       │   ├── Courses
│   │       │   ├── CourseDetail
│   │       │   ├── Learning
│   │       │   ├── MyCourses
│   │       │   ├── Certificates
│   │       │   └── Quiz
│   │       │
│   │       ├── Instructor Routes (RoleRoute)
│   │       │   ├── InstructorDashboard
│   │       │   ├── InstructorCourses
│   │       │   ├── InstructorCourseDetail
│   │       │   ├── CreateCourse
│   │       │   ├── QuizManager
│   │       │   └── StudentProgress
│   │       │
│   │       └── Admin Routes (RoleRoute)
│   │           ├── AdminDashboard
│   │           ├── AdminCourses
│   │           ├── PendingCourses
│   │           └── UserManagement
│   │
│   └── Navbar (Global)
│       └── NotificationBell
│
└── ToastContainer
```

### 5.2 State Management

#### Auth Context
```javascript
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {},
  logout: () => {},
  loading: false
});
```

#### API Configuration
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 5.3 Routing Structure

```javascript
// Route Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'courses', element: <Courses /> },
      { path: 'courses/:id', element: <CourseDetail /> },
      
      // Protected routes
      {
        element: <PrivateRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'my-courses', element: <MyCourses /> },
          { path: 'certificates', element: <Certificates /> },
          { path: 'learn/:courseId', element: <Learning /> },
          { path: 'quiz/:id', element: <Quiz /> },
          
          // Instructor only
          {
            element: <RoleRoute allowedRoles={['INSTRUCTOR', 'ADMIN']} />,
            children: [
              { path: 'instructor', element: <InstructorDashboard /> },
              { path: 'instructor/courses', element: <InstructorCourses /> },
              { path: 'instructor/courses/create', element: <CreateCourse /> },
              { path: 'instructor/courses/:id', element: <InstructorCourseDetail /> },
              { path: 'instructor/courses/:id/quiz', element: <QuizManager /> },
              { path: 'instructor/courses/:id/progress', element: <StudentProgress /> },
            ]
          },
          
          // Admin only
          {
            element: <RoleRoute allowedRoles={['ADMIN']} />,
            children: [
              { path: 'admin', element: <AdminDashboard /> },
              { path: 'admin/courses', element: <AdminCourses /> },
              { path: 'admin/pending', element: <PendingCourses /> },
              { path: 'admin/users', element: <UserManagement /> },
            ]
          }
        ]
      }
    ]
  }
]);
```

---

## 6. Backend Architecture

### 6.1 Middleware Stack

```javascript
// Request Flow
app.use(cors());                    // 1. Enable CORS
app.use(rateLimit());               // 2. Rate limiting
app.use(express.json());            // 3. Parse JSON body
app.use(authMiddleware);            // 4. Verify JWT (protected routes)
app.use(validateRequest);           // 5. Validate input
app.use(routes);                    // 6. Route handlers
app.use(errorHandler);              // 7. Error handling
```

### 6.2 Authentication Middleware

```javascript
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

### 6.3 Role Authorization Middleware

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Usage
app.get('/api/admin/users', 
  authenticate, 
  authorize('ADMIN'), 
  getAllUsers
);
```

### 6.4 Error Handling

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};
```

### 6.5 Socket.io Implementation

```javascript
// Server-side (config/socket.js)
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  global.io = io;
  return io;
};

// Client-side (services/socket.js)
const socket = io(import.meta.env.VITE_API_URL);

export const subscribeToNotifications = (callback) => {
  socket.on('notification', callback);
};

export const unsubscribeFromNotifications = () => {
  socket.off('notification');
};
```

---

## 7. Security Implementation

### 7.1 JWT Token Structure

```javascript
// Token Payload
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "STUDENT",
  "iat": 1714636800,
  "exp": 1717241600
}

// Token Generation
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

### 7.2 Password Security

```javascript
// Hashing
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### 7.3 Input Validation

```javascript
const { body, validationResult } = require('express-validator');

const validateCourse = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
```

### 7.4 File Upload Security

```javascript
const multer = require('multer');
const path = require('path');

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Size limit
const upload = multer({
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```

---

## 8. Deployment Guide

### 8.1 Environment Variables for Production

```env
# Server .env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://prod_user:strong_password@prod_host:5432/lms_prod"
JWT_SECRET="your-super-strong-secret-min-32-chars-long"
CLIENT_URL="https://yourdomain.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
```

### 8.2 Render.com Deployment (Recommended)

**Backend Deployment:**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Build command: `npm install`
6. Start command: `npm start`

**Frontend Deployment:**
1. Create Static Site on Render
2. Connect same repository
3. Build command: `cd client && npm install && npm run build`
4. Publish directory: `client/dist`

### 8.3 Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/lms
      - JWT_SECRET=secret
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=lms
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 9. Performance Optimization

### 9.1 Database Optimization
- Use indexes on frequently queried columns
- Implement pagination for large datasets
- Use Prisma's select to fetch only required fields

### 9.2 Frontend Optimization
- Lazy loading for route components
- Image optimization with Cloudinary
- Debounce search inputs
- Memoize expensive computations

### 9.3 Caching Strategy
- Redis for session storage (future enhancement)
- Browser caching for static assets
- CDN for media delivery via Cloudinary

---

**Technical Documentation Version**: 1.0
**Last Updated**: May 2026
