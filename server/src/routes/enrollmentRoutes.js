import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  unenrollFromCourse,
  getEnrollmentByCourse
} from '../controllers/enrollmentController.js';
import { verifyToken, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// All enrollment routes require authentication
router.use(verifyToken);

// Enroll in a course (Students only)
router.post('/:courseId', isStudent, enrollInCourse);

// Get my enrolled courses
router.get('/my-courses', getMyEnrollments);

// Get enrollment details for a specific course
router.get('/course/:courseId', getEnrollmentByCourse);

// Unenroll from a course
router.delete('/:courseId', unenrollFromCourse);

export default router;
