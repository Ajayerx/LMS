# LearnHub LMS - Project Overview & Features Documentation

## Project Title
**LearnHub - Learning Management System (LMS)**

## Submitted By
[Your Name]
[Your Roll Number]
[Department/College Name]

---

## 1. Executive Summary

LearnHub is a comprehensive, full-stack Learning Management System designed to facilitate online education through an intuitive, modern web interface. The platform connects three key stakeholders—Students, Instructors, and Administrators—in a unified ecosystem for course creation, learning, assessment, and certification.

### Key Highlights
- **Technology Stack**: MERN-inspired (React, Node.js, Express, PostgreSQL)
- **Architecture**: RESTful API with real-time notifications
- **Security**: JWT authentication, role-based access control, rate limiting
- **Scalability**: Cloud-ready with Cloudinary integration for media storage

---

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Client  │────▶│  Express Server │────▶│   PostgreSQL    │
│   (Vite + Tail) │◄────│   (Node.js)     │◄────│   (Prisma ORM)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                         │
        ▼                         ▼
┌─────────────────┐     ┌─────────────────┐
│  Cloudinary     │     │   Socket.io     │
│  (Media Storage)│     │  (Real-time)    │
└─────────────────┘     └─────────────────┘
```

### 2.2 Three-Tier Architecture
1. **Presentation Layer**: React-based SPA with Tailwind CSS
2. **Application Layer**: REST API with Express.js
3. **Data Layer**: PostgreSQL database with Prisma ORM

---

## 3. User Roles & Personas

### 3.1 Student
- Browse and search available courses
- Enroll in courses (free or paid)
- Watch video lectures and track progress
- Take quizzes and assessments
- Earn completion certificates
- View learning analytics

### 3.2 Instructor
- Create and publish courses
- Add chapters with video content
- Create quizzes with multiple-choice questions
- Track student progress and engagement
- View course analytics
- Manage course content

### 3.3 Administrator
- User management (activate/deactivate accounts)
- Course approval workflow
- Platform analytics and statistics
- Monitor pending courses
- System oversight and maintenance

---

## 4. Core Features

### 4.1 Authentication & Security
- **JWT-based Authentication**: Secure token-based login
- **Role-based Access Control (RBAC)**: Three-tier permission system
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend origin
- **Password Hashing**: bcrypt with salt rounds

### 4.2 Course Management
- **Course Creation**: Instructors can create courses with metadata
- **Course Approval Workflow**: Admin approval required before publishing
- **Course Status Tracking**: PENDING, APPROVED, REJECTED states
- **Course Categorization**: Category-based organization
- **Course Thumbnails**: Cloudinary image upload

### 4.3 Chapter & Content Management
- **Video Chapters**: Upload and stream video content
- **Chapter Ordering**: Drag-and-drop ordering
- **Progress Tracking**: Track watched/unwatched chapters
- **Duration Tracking**: Automatic video duration calculation
- **Content Security**: Protected video routes

### 4.4 Quiz & Assessment System
- **Quiz Creation**: Multiple quizzes per course
- **Question Types**: Multiple choice with custom options
- **Scoring System**: Automatic score calculation
- **Attempt Tracking**: Track student quiz attempts
- **Answer Validation**: Server-side validation

### 4.5 Enrollment & Progress
- **Course Enrollment**: One-click enrollment system
- **Progress Tracking**: Chapter-level progress monitoring
- **Completion Percentage**: Real-time progress calculation
- **Enrollment History**: Track all enrolled courses

### 4.6 Certificate Generation
- **Auto-generation**: Certificates issued on course completion
- **PDF Generation**: Server-side PDF certificate creation
- **Verification**: Unique certificate IDs
- **Download**: Download certificates as PDF

### 4.7 Notifications System
- **Real-time Notifications**: Socket.io integration
- **Event Triggers**: Course approval, new enrollments
- **Unread Indicators**: Notification badges
- **Notification History**: Persistent notification storage

### 4.8 Analytics & Dashboard
- **Admin Dashboard**: Platform-wide statistics
- **Instructor Dashboard**: Course-specific analytics
- **Student Dashboard**: Learning progress overview
- **Charts & Graphs**: Recharts integration for data visualization

---

## 5. Database Schema

### 5.1 Entity Relationship Summary
- **User**: Central entity with role-based relationships
- **Course**: Owned by instructors, enrolled by students
- **Chapter**: Child of courses with progress tracking
- **Quiz/Question**: Assessment system with attempts
- **Enrollment**: Many-to-many relationship resolver
- **Certificate**: Completion proof with PDF URL
- **Notification**: User-specific message system

### 5.2 Key Relationships
```
User (1) ────────< (N) Course (Instructor)
User (1) ────────< (N) Enrollment
User (1) ────────< (N) ChapterProgress
User (1) ────────< (N) QuizAttempt
User (1) ────────< (N) Notification
User (1) ────────< (N) Certificate

Course (1) ──────< (N) Chapter
Course (1) ──────< (N) Enrollment
Course (1) ──────< (N) Quiz
Course (1) ──────< (N) Certificate

Quiz (1) ────────< (N) Question
Quiz (1) ────────< (N) QuizAttempt
```

---

## 6. API Endpoints Summary

### 6.1 Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `GET /me` - Get current user

### 6.2 Courses (`/api/courses`)
- `GET /` - List all approved courses
- `GET /:id` - Get course details
- `POST /` - Create new course (Instructor)
- `PUT /:id` - Update course (Instructor)
- `DELETE /:id` - Delete course (Instructor)
- `GET /instructor/my-courses` - Get instructor's courses

### 6.3 Chapters (`/api`)
- `GET /course/:id/chapters` - Get course chapters
- `POST /course/:id/chapters` - Add chapter (Instructor)
- `PUT /chapters/:id` - Update chapter (Instructor)
- `DELETE /chapters/:id` - Delete chapter (Instructor)

### 6.4 Quizzes (`/api`)
- `GET /course/:id/quizzes` - Get course quizzes
- `POST /courses/:id/quiz` - Create quiz (Instructor)
- `POST /quiz/:id/questions` - Add questions (Instructor)
- `GET /quiz/:id` - Get quiz with questions

### 6.5 Enrollments (`/api/enrollments`)
- `GET /my-courses` - Get student's enrolled courses
- `GET /course/:id` - Check enrollment status
- `POST /:courseId` - Enroll in course

### 6.6 Progress (`/api/progress`)
- `GET /course/:id` - Get course progress
- `POST /:chapterId` - Mark chapter as watched

### 6.7 Certificates (`/api/certificates`)
- `GET /my-certificates` - Get user's certificates
- `POST /:courseId` - Generate certificate

### 6.8 Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `GET /?unreadOnly=true` - Get unread count

### 6.9 Admin (`/api/admin`)
- `GET /stats` - Platform statistics
- `GET /users` - List all users
- `GET /courses` - List all courses
- `GET /pending-courses` - List pending approvals
- `PATCH /users/:id/toggle-status` - Activate/deactivate user
- `PATCH /courses/:id/approve` - Approve/reject course

---

## 7. Frontend Architecture

### 7.1 Page Structure
```
/public
  └── Home.jsx          - Landing page with stats
/src/pages
  ├── Courses.jsx       - Browse all courses
  ├── CourseDetail.jsx  - Course information
  ├── Learning.jsx      - Video player & chapters
  ├── Dashboard.jsx     - Student dashboard
  ├── MyCourses.jsx     - Enrolled courses
  ├── Certificates.jsx  - View/download certificates
  ├── Quiz.jsx          - Take quizzes
  ├── Login.jsx         - Authentication
  ├── Register.jsx      - User registration
  ├── admin/
  │   ├── AdminDashboard.jsx
  │   ├── AdminCourses.jsx
  │   ├── PendingCourses.jsx
  │   └── UserManagement.jsx
  └── instructor/
      ├── InstructorDashboard.jsx
      ├── InstructorCourses.jsx
      ├── InstructorCourseDetail.jsx
      ├── CreateCourse.jsx
      ├── QuizManager.jsx
      └── StudentProgress.jsx
```

### 7.2 Component Architecture
- **UI Components**: Reusable Button, Card, Badge, Avatar, etc.
- **Course Components**: CourseCard, CourseCardSkeleton
- **Layout Components**: Navbar, PageTransition
- **Auth Components**: PrivateRoute, RoleRoute

---

## 8. Key Technical Features

### 8.1 Real-time Communication
- **Socket.io**: Bidirectional event-based communication
- **Notifications**: Real-time notification delivery
- **User Presence**: Online/offline status tracking

### 8.2 Media Handling
- **Cloudinary**: Cloud-based image and video storage
- **Multer**: File upload handling
- **React Player**: Video playback in browser

### 8.3 State Management
- **React Context**: AuthContext for user state
- **Local Storage**: JWT token persistence
- **React State**: Component-level state management

### 8.4 UI/UX Features
- **Framer Motion**: Page transitions and animations
- **Tailwind CSS**: Utility-first responsive styling
- **Lucide Icons**: Consistent iconography
- **Recharts**: Data visualization charts

---

## 9. Security Measures

1. **Authentication**: JWT tokens with secure storage
2. **Authorization**: Middleware-based role verification
3. **Input Validation**: express-validator for request validation
4. **Rate Limiting**: Express-rate-limit for DDoS protection
5. **CORS**: Restricted cross-origin requests
6. **SQL Injection**: Prisma ORM parameterized queries
7. **XSS Protection**: React's built-in sanitization

---

## 10. Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Live video streaming (WebRTC)
- Discussion forums
- Assignment submission system
- Email notifications (Nodemailer)
- Mobile app (React Native)
- AI-powered course recommendations

---

**Document Version**: 1.0
**Last Updated**: May 2026
**Project Status**: Production Ready
