# Learning Management System (LMS)

A modern, full-stack Learning Management System built with React, Node.js, Express, PostgreSQL, and Prisma ORM. Features real-time notifications, role-based access control, video learning, quizzes, and certificate generation.

![LMS Screenshot Placeholder](screenshots/home.png)

## Features

### For Students
- Browse and enroll in courses
- Video-based learning with progress tracking
- Take quizzes and assessments
- Download certificates upon completion
- Real-time notifications for course updates
- Track learning progress with visual indicators

### For Instructors
- Create and manage courses with chapters
- Upload video content to Cloudinary
- Create quizzes with multiple-choice questions
- View student progress and enrollment stats
- Track course analytics

### For Admins
- Dashboard with statistics and enrollment charts
- Approve or reject pending courses
- User management with activation/deactivation
- View all courses and their status
- Real-time system monitoring

### Technical Features
- Real-time notifications via Socket.io
- JWT-based authentication with role-based access
- File upload to Cloudinary (images & videos)
- PDF certificate generation
- Rate limiting and request validation
- Responsive design for all devices
- Error boundaries and 404 handling

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Socket.io-client** for real-time features
- **React Toastify** for notifications
- **Recharts** for data visualization
- **React Player** for video playback
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Prisma ORM** for database management
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Cloudinary** for file storage
- **PDFKit** for PDF generation
- **Express Validator** for input validation
- **Express Rate Limit** for API protection
- **Bcrypt** for password hashing

### Database
- **PostgreSQL** with Prisma schema

## Project Structure

```
EMS/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Auth/
│   │   │   ├── Layout/
│   │   │   └── ...
│   │   ├── context/         # React context (AuthContext)
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin panel pages
│   │   │   ├── instructor/  # Instructor pages
│   │   │   └── ...
│   │   ├── services/        # API & Socket services
│   │   └── App.jsx          # Main app component
│   └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── config/          # Config (Prisma, Cloudinary, Socket)
│   │   └── index.js         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed script
│   └── package.json
├── .env.example             # Example environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account (for file uploads)

### 1. Install Dependencies

```bash
# Install all dependencies (root, client, server)
npm run install:all

# Or manually:
cd server && npm install
cd ../client && npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` in both client and server directories:

```bash
cp .env.example server/.env
# Edit server/.env with your credentials
```

### 3. Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Run the Application

```bash
# Start both client and server from root
npm run dev

# Or run separately:
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Seed Users

After running the seed script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | admin123 |
| Instructor | instructor@lms.com | instructor123 |
| Student 1 | student1@lms.com | student123 |
| Student 2 | student2@lms.com | student123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all approved courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `PATCH /api/courses/:id/approve` - Approve/reject course (Admin)

### Chapters
- `GET /api/course/:id/chapters` - Get course chapters
- `POST /api/course/:id/chapters` - Add chapter
- `PUT /api/chapters/:id` - Update chapter
- `DELETE /api/chapters/:id` - Delete chapter

### Enrollments
- `GET /api/enrollments/my-courses` - Get my enrolled courses
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/:id/progress` - Get progress

### Quizzes
- `GET /api/course/:id/quiz` - Get course quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers
- `POST /api/courses/:id/quiz` - Create quiz (Instructor)

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/pending-courses` - Pending approvals
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/toggle-status` - Activate/deactivate user

## Screenshots

### Home Page
![Home](screenshots/home.png)

### Course Browse
![Courses](screenshots/courses.png)

### Learning Page
![Learning](screenshots/learning.png)

### Admin Dashboard
![Admin](screenshots/admin.png)

## License

MIT License - feel free to use this project for your own learning or commercial purposes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
