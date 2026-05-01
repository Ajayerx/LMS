import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { loginValidator, registerValidator } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/me', verifyToken, getMe);

export default router;
