import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  approveCourse,
  getInstructorCourses
} from '../controllers/courseController.js';
import { verifyToken, checkRole, isAdmin, isInstructor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes - Instructor only
router.post('/', verifyToken, isInstructor, createCourse);
router.get('/instructor/my-courses', verifyToken, isInstructor, getInstructorCourses);
router.put('/:id', verifyToken, isInstructor, updateCourse);
router.delete('/:id', verifyToken, isInstructor, deleteCourse);

// Protected routes - Admin only
router.patch('/:id/approve', verifyToken, isAdmin, approveCourse);

export default router;
