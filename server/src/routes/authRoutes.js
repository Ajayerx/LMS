import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { loginValidator, registerValidator } from '../middleware/validators.js';

const router = express.Router();

// Auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes with rate limiting and validation
router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);

// Protected routes
router.get('/me', verifyToken, getMe);

export default router;
