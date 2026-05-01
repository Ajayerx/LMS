import express from 'express';
import {
  createChapter,
  getChaptersByCourse,
  getChapterById,
  updateChapter,
  deleteChapter
} from '../controllers/chapterController.js';
import { verifyToken, isInstructor, isStudent } from '../middleware/authMiddleware.js';
import { uploadVideo, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get all chapters for a course (Public/Authenticated)
router.get('/course/:courseId/chapters', getChaptersByCourse);

// Get single chapter by ID (Authenticated - checks enrollment)
router.get('/chapters/:id', verifyToken, getChapterById);

// Create chapter with video upload (Instructor only)
router.post(
  '/course/:courseId/chapters',
  verifyToken,
  isInstructor,
  uploadVideo.single('video'),
  handleUploadError,
  createChapter
);

// Update chapter (Instructor only)
router.put(
  '/chapters/:id',
  verifyToken,
  isInstructor,
  uploadVideo.single('video'),
  handleUploadError,
  updateChapter
);

// Delete chapter (Instructor only)
router.delete('/chapters/:id', verifyToken, isInstructor, deleteChapter);

export default router;
