import express from 'express';
import {
  createQuiz,
  addQuestions,
  getQuiz,
  submitQuizAttempt,
  getQuizResult,
  getQuizzesByCourse,
  deleteQuiz
} from '../controllers/quizController.js';
import { verifyToken, isInstructor, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all quizzes for a course
router.get('/course/:courseId/quizzes', verifyToken, getQuizzesByCourse);

// Create quiz (Instructor only)
router.post('/course/:courseId/quiz', verifyToken, isInstructor, createQuiz);

// Add questions to quiz (Instructor only)
router.post('/quiz/:quizId/questions', verifyToken, isInstructor, addQuestions);

// Get quiz with questions (Enrolled students, owner, admin)
router.get('/quiz/:quizId', verifyToken, getQuiz);

// Submit quiz attempt (Students only)
router.post('/quiz/:quizId/attempt', verifyToken, isStudent, submitQuizAttempt);

// Get quiz result (Authenticated)
router.get('/quiz/:quizId/result', verifyToken, getQuizResult);

// Delete quiz (Instructor/Admin)
router.delete('/quiz/:quizId', verifyToken, isInstructor, deleteQuiz);

export default router;
