import express from 'express';
import {
  markChapterAsWatched,
  markChapterAsUnwatched,
  getCourseProgress,
  getLearningStats
} from '../controllers/progressController.js';
import { verifyToken, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// All progress routes require authentication
router.use(verifyToken);

// Mark chapter as watched (Students only)
router.post('/:chapterId', isStudent, markChapterAsWatched);

// Mark chapter as unwatched (Students only)
router.post('/:chapterId/unwatch', isStudent, markChapterAsUnwatched);

// Get chapter-wise progress for a course
router.get('/course/:courseId', getCourseProgress);

// Get overall learning stats
router.get('/stats/overview', getLearningStats);

export default router;
