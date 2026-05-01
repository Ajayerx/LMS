import prisma from '../config/prisma.js';
import { createNotification } from './notificationController.js';

// Create a quiz for a course
export const createQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const instructorId = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Quiz title is required'
      });
    }

    // Check if course exists and belongs to instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify ownership or admin
    if (course.instructorId !== instructorId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only create quizzes for your own courses.'
      });
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: { questions: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// Add questions to a quiz
export const addQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body; // Array of { questionText, options, correctAnswer }
    const instructorId = req.user.id;

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required and must not be empty'
      });
    }

    // Validate each question
    for (const q of questions) {
      if (!q.questionText || !Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Each question must have questionText and exactly 4 options'
        });
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        return res.status(400).json({
          success: false,
          message: 'correctAnswer must be a number between 0 and 3'
        });
      }
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Verify ownership or admin
    if (quiz.course.instructorId !== instructorId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only add questions to your own quizzes.'
      });
    }

    // Create questions
    const createdQuestions = await prisma.$transaction(
      questions.map(q =>
        prisma.question.create({
          data: {
            quizId,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: String(q.correctAnswer)
          }
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions added successfully`,
      questions: createdQuestions
    });
  } catch (error) {
    console.error('Add questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding questions',
      error: error.message
    });
  }
};

// Get quiz with questions
export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const user = req.user;

    // Get quiz with course info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true
          }
        },
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            correctAnswer: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = user ? await prisma.enrollment.findFirst({
      where: {
        courseId: quiz.courseId,
        studentId: user.id
      }
    }) : null;

    const isOwner = user && quiz.course.instructorId === user.id;
    const isAdmin = user && user.role === 'ADMIN';

    // Only enrolled students, owner, or admin can access quiz
    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Enroll in the course to take this quiz.'
      });
    }

    // Hide correctAnswer for students (show only to owner/admin)
    let questions = quiz.questions;
    if (!isOwner && !isAdmin) {
      questions = quiz.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options
        // correctAnswer is hidden
      }));
    }

    // Get user's previous attempts
    const previousAttempts = user ? await prisma.quizAttempt.findMany({
      where: {
        quizId,
        studentId: user.id
      },
      orderBy: {
        attemptedAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        score: true,
        attemptedAt: true
      }
    }) : [];

    res.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        courseId: quiz.courseId,
        createdAt: quiz.createdAt,
        course: quiz.course,
        questionCount: quiz.questions.length
      },
      questions,
      previousAttempts: previousAttempts.length > 0 ? previousAttempts : undefined,
      canViewAnswers: isOwner || isAdmin
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of answer indices
    const studentId = req.user.id;

    // Validate answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be an array of indices'
      });
    }

    // Get quiz with questions and course info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            instructorId: true
          }
        },
        questions: {
          select: {
            id: true,
            correctAnswer: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Prevent instructor from taking own quiz
    if (quiz.course.instructorId === studentId) {
      return res.status(400).json({
        success: false,
        message: 'Instructors cannot take their own quizzes'
      });
    }

    // Check if enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: quiz.courseId,
        studentId
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to take this quiz'
      });
    }

    // Calculate score
    let correctCount = 0;
    const questionCount = quiz.questions.length;

    // Match answers by question index
    const detailedResults = quiz.questions.map((question, index) => {
      const submittedAnswer = answers[index];
      const correctAnswer = parseInt(question.correctAnswer);
      const isCorrect = submittedAnswer === correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        submittedAnswer,
        correctAnswer,
        isCorrect
      };
    });

    // Calculate percentage score
    const score = questionCount > 0 ? (correctCount / questionCount) * 100 : 0;

    // Save quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        score: Math.round(score * 100) / 100, // Round to 2 decimal places
        attemptedAt: new Date()
      }
    });

    // Create notification for instructor
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true }
    });

    await createNotification(
      quiz.course.instructorId,
      `Student "${student.name}" completed quiz "${quiz.title}" with score ${attempt.score}%`,
      'INFO'
    );

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      attempt: {
        id: attempt.id,
        score: attempt.score,
        correctCount,
        totalQuestions: questionCount,
        attemptedAt: attempt.attemptedAt
      },
      results: detailedResults
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
};

// Get quiz result for a student
export const getQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true
          }
        },
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            correctAnswer: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get latest attempt
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId,
        studentId
      },
      orderBy: {
        attemptedAt: 'desc'
      }
    });

    if (!latestAttempt) {
      return res.status(404).json({
        success: false,
        message: 'No quiz attempt found. Take the quiz first.'
      });
    }

    // Get all attempts for stats
    const allAttempts = await prisma.quizAttempt.findMany({
      where: {
        quizId,
        studentId
      },
      orderBy: {
        attemptedAt: 'desc'
      },
      select: {
        id: true,
        score: true,
        attemptedAt: true
      }
    });

    const isOwner = quiz.course.instructorId === studentId;
    const isAdmin = req.user.role === 'ADMIN';

    res.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        courseId: quiz.courseId,
        course: quiz.course
      },
      latestAttempt: {
        id: latestAttempt.id,
        score: latestAttempt.score,
        attemptedAt: latestAttempt.attemptedAt
      },
      questions: quiz.questions, // Include correct answers for review
      attemptHistory: allAttempts,
      totalAttempts: allAttempts.length,
      bestScore: Math.max(...allAttempts.map(a => a.score)),
      averageScore: Math.round(
        allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length * 100
      ) / 100
    });
  } catch (error) {
    console.error('Get quiz result error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz result',
      error: error.message
    });
  }
};

// Get all quizzes for a course
export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check access
    const isEnrolled = user ? await prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId: user.id
      }
    }) : null;

    const isOwner = user && course.instructorId === user.id;
    const isAdmin = user && user.role === 'ADMIN';

    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Enroll in the course to view quizzes.'
      });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { questions: true, attempts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get user's attempts for each quiz
    const quizzesWithUserAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const userAttempt = user ? await prisma.quizAttempt.findFirst({
          where: {
            quizId: quiz.id,
            studentId: user.id
          },
          orderBy: {
            attemptedAt: 'desc'
          },
          select: {
            score: true,
            attemptedAt: true
          }
        }) : null;

        return {
          ...quiz,
          userAttempt
        };
      })
    );

    res.json({
      success: true,
      count: quizzes.length,
      quizzes: quizzesWithUserAttempts
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get quiz with course info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    const isOwner = quiz.course.instructorId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete quizzes from your own courses.'
      });
    }

    // Delete quiz (cascade will delete questions and attempts)
    await prisma.quiz.delete({
      where: { id: quizId }
    });

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};
