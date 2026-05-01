import express from 'express';
import {
  getStats,
  getAllUsers,
  toggleUserStatus,
  getPendingCourses,
  getUserDetails,
  getCourseAnalytics,
  getAllCourses
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, isAdmin);

// Platform statistics
router.get('/stats', getStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/toggle-status', toggleUserStatus);

// Course management
router.get('/pending-courses', getPendingCourses);
router.get('/courses', getAllCourses);
router.get('/courses/:courseId/analytics', getCourseAnalytics);

export default router;
