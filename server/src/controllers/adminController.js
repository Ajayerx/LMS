import prisma from '../config/prisma.js';

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    // Get counts in parallel
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalInstructors,
      totalStudents,
      pendingCourses,
      totalQuizzes,
      totalCertificates,
      totalChapters
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count({ where: { status: 'PENDING' } }),
      prisma.quiz.count(),
      prisma.certificate.count(),
      prisma.chapter.count()
    ]);

    // Get recent activity
    const recentEnrollments = await prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: { select: { name: true } },
        course: { select: { title: true } }
      }
    });

    const recentCourses = await prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { name: true } }
      }
    });

    // Calculate revenue (sum of all course prices)
    const coursesWithPrice = await prisma.course.findMany({
      select: { price: true }
    });
    const totalRevenue = coursesWithPrice.reduce((sum, course) => sum + (course.price || 0), 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalInstructors,
        totalStudents,
        pendingCourses,
        totalQuizzes,
        totalCertificates,
        totalChapters,
        totalRevenue
      },
      recentActivity: {
        recentEnrollments,
        recentCourses
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Get all users with optional role filter
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role && ['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
              createdCourses: true,
              certificates: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      count: users.length,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating self
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    // Prevent deactivating other admins
    if (user.role === 'ADMIN' && user.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot deactivate other admin accounts'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Get pending courses for approval
export const getPendingCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where: { status: 'PENDING' },
        skip,
        take: parseInt(limit),
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              chapters: true,
              enrollments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where: { status: 'PENDING' } })
    ]);

    res.json({
      success: true,
      count: courses.length,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      courses
    });
  } catch (error) {
    console.error('Get pending courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending courses',
      error: error.message
    });
  }
};

// Get detailed user info
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                instructor: { select: { name: true } }
              }
            }
          }
        },
        createdCourses: {
          include: {
            _count: {
              select: {
                chapters: true,
                enrollments: true
              }
            }
          }
        },
        certificates: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        quizAttempts: {
          include: {
            quiz: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            attemptedAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate average quiz score
    const avgQuizScore = user.quizAttempts.length > 0
      ? user.quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / user.quizAttempts.length
      : 0;

    res.json({
      success: true,
      user: {
        ...user,
        stats: {
          totalEnrollments: user.enrollments.length,
          totalCoursesCreated: user.createdCourses.length,
          totalCertificates: user.certificates.length,
          totalQuizAttempts: user.quizAttempts.length,
          averageQuizScore: Math.round(avgQuizScore * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};

// Get course analytics
export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: { name: true }
        },
        chapters: {
          select: {
            id: true,
            title: true
          }
        },
        enrollments: {
          include: {
            student: {
              select: { name: true }
            }
          }
        },
        quizzes: {
          include: {
            _count: {
              select: { attempts: true }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate average progress
    const avgProgress = course.enrollments.length > 0
      ? course.enrollments.reduce((sum, e) => sum + e.progress, 0) / course.enrollments.length
      : 0;

    // Get completion count
    const completedCount = course.enrollments.filter(e => e.progress === 100).length;

    res.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor.name,
        status: course.status,
        createdAt: course.createdAt
      },
      analytics: {
        totalEnrollments: course.enrollments.length,
        totalChapters: course.chapters.length,
        totalQuizzes: course.quizzes.length,
        averageProgress: Math.round(avgProgress * 100) / 100,
        completedCount,
        completionRate: course.enrollments.length > 0
          ? Math.round((completedCount / course.enrollments.length) * 100)
          : 0
      },
      recentEnrollments: course.enrollments.slice(0, 10)
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course analytics',
      error: error.message
    });
  }
};

// Get all courses with filters
export const getAllCourses = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              chapters: true,
              enrollments: true,
              quizzes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      success: true,
      count: courses.length,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};
