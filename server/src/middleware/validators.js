import { body, param, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth Validators
export const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['STUDENT', 'INSTRUCTOR'])
    .withMessage('Role must be either STUDENT or INSTRUCTOR'),
  handleValidationErrors
];

export const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Course Validators
export const createCourseValidator = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be between 0 and 10000'),
  handleValidationErrors
];

export const updateCourseValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid course ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be between 0 and 10000'),
  handleValidationErrors
];

// Chapter Validators
export const createChapterValidator = [
  param('courseId')
    .isUUID()
    .withMessage('Invalid course ID'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  handleValidationErrors
];

export const updateChapterValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid chapter ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  handleValidationErrors
];

// Quiz Validators
export const createQuizValidator = [
  param('courseId')
    .isUUID()
    .withMessage('Invalid course ID'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Quiz title is required'),
  handleValidationErrors
];

export const addQuestionValidator = [
  param('quizId')
    .isUUID()
    .withMessage('Invalid quiz ID'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Questions must be a non-empty array'),
  body('questions.*.questionText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Question text is required'),
  body('questions.*.options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Each question must have 2-6 options'),
  body('questions.*.correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer must be a valid option index'),
  handleValidationErrors
];

// ID Parameter Validator
export const idParamValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Pagination Validator
export const paginationValidator = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

export default {
  handleValidationErrors,
  registerValidator,
  loginValidator,
  createCourseValidator,
  updateCourseValidator,
  createChapterValidator,
  updateChapterValidator,
  createQuizValidator,
  addQuestionValidator,
  idParamValidator,
  paginationValidator
};
