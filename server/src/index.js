import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

console.log('🚀 [Server] Starting LMS Server...');
console.log('🔍 [Server] NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔍 [Server] PORT:', process.env.PORT || 5000);
console.log('🔍 [Server] DATABASE_URL at index.js load:', !!process.env.DATABASE_URL);

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/user.routes.js';
import { initializeSocket } from './config/socket.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

console.log('🔌 [Server] Initializing Socket.io...');
initializeSocket(httpServer);
console.log('✅ [Server] Socket.io initialized');

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

console.log('🌐 [Server] CORS origin set to:', corsOptions.origin);
app.use(cors(corsOptions));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger — shows every incoming request in terminal
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

console.log('📋 [Server] Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', chapterRoutes);
app.use('/api', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
console.log('✅ [Server] All routes registered');

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: !!process.env.DATABASE_URL ? 'configured' : 'missing ❌'
  });
});

app.use((req, res) => {
  console.warn(`⚠️  [Server] 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════╗');
  console.log(`║  ✅ Server running on port ${PORT}     ║`);
  console.log(`║  🌐 CORS: ${corsOptions.origin}`);
  console.log(`║  🗄️  DB configured: ${!!process.env.DATABASE_URL}          ║`);
  console.log(`║  🔑 JWT configured: ${!!process.env.JWT_SECRET}          ║`);
  console.log('╚════════════════════════════════════╝');
  console.log('');
});