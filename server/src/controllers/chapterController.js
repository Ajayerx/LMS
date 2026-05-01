import prisma from '../config/prisma.js';
import { deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';

// Create a new chapter with video upload
export const createChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, order, duration } = req.body;
    const instructorId = req.user.id;

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
        message: 'Access denied. You can only add chapters to your own courses.'
      });
    }

    // Check if order already exists
    if (order !== undefined) {
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          courseId,
          order: parseInt(order)
        }
      });

      if (existingChapter) {
        return res.status(400).json({
          success: false,
          message: `A chapter with order ${order} already exists in this course`
        });
      }
    }

    // Get video info from uploaded file
    let videoUrl = null;
    let videoDuration = duration ? parseInt(duration) : null;

    if (req.file) {
      videoUrl = req.file.path;
      // If Cloudinary provides duration in the response
      if (req.file.duration) {
        videoDuration = Math.round(req.file.duration);
      }
    }

    // Create chapter
    const chapter = await prisma.chapter.create({
      data: {
        title,
        videoUrl,
        duration: videoDuration,
        order: order !== undefined ? parseInt(order) : 0,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      chapter
    });
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chapter',
      error: error.message
    });
  }
};

// Get all chapters for a course
export const getChaptersByCourse = async (req, res) => {
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

    // Check access permissions
    const isEnrolled = user ? await prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId: user.id
      }
    }) : null;

    const isOwner = user && course.instructorId === user.id;
    const isAdmin = user && user.role === 'ADMIN';

    // Only show chapters to enrolled students, owner, or admin
    if (course.status !== 'APPROVED' && !isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const chapters = await prisma.chapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        duration: true,
        order: true,
        courseId: true,
        // Only show video URL to enrolled students or owner/admin
        ...(isEnrolled || isOwner || isAdmin ? {} : { videoUrl: false })
      }
    });

    // If user is enrolled, get their progress
    let chaptersWithProgress = chapters;
    if (user && isEnrolled) {
      const progress = await prisma.chapterProgress.findMany({
        where: {
          studentId: user.id,
          chapterId: { in: chapters.map(c => c.id) }
        }
      });

      chaptersWithProgress = chapters.map(chapter => ({
        ...chapter,
        progress: progress.find(p => p.chapterId === chapter.id) || null
      }));
    }

    res.json({
      success: true,
      count: chapters.length,
      chapters: chaptersWithProgress,
      isEnrolled: !!isEnrolled,
      isOwner: isOwner || isAdmin
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chapters',
      error: error.message
    });
  }
};

// Update a chapter
export const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order, duration } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Check ownership
    const isOwner = chapter.course.instructorId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update chapters in your own courses.'
      });
    }

    // Check if new order conflicts
    if (order !== undefined && parseInt(order) !== chapter.order) {
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          courseId: chapter.courseId,
          order: parseInt(order),
          id: { not: id }
        }
      });

      if (existingChapter) {
        return res.status(400).json({
          success: false,
          message: `Another chapter with order ${order} already exists`
        });
      }
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = parseInt(order);
    if (duration !== undefined) updateData.duration = parseInt(duration);

    // Handle video upload if new file provided
    if (req.file) {
      // Delete old video from Cloudinary
      if (chapter.videoUrl) {
        const publicId = extractPublicId(chapter.videoUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
      updateData.videoUrl = req.file.path;
      if (req.file.duration) {
        updateData.duration = Math.round(req.file.duration);
      }
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Chapter updated successfully',
      chapter: updatedChapter
    });
  } catch (error) {
    console.error('Update chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chapter',
      error: error.message
    });
  }
};

// Delete a chapter
export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find chapter with course info
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Check ownership
    const isOwner = chapter.course.instructorId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete chapters from your own courses.'
      });
    }

    // Delete video from Cloudinary
    if (chapter.videoUrl) {
      const publicId = extractPublicId(chapter.videoUrl);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting video from Cloudinary:', cloudinaryError);
          // Continue with chapter deletion even if Cloudinary delete fails
        }
      }
    }

    // Delete chapter (cascade will handle related progress records)
    await prisma.chapter.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chapter',
      error: error.message
    });
  }
};

// Get single chapter by ID
export const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
            status: true
          }
        }
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Check access permissions
    const isEnrolled = user ? await prisma.enrollment.findFirst({
      where: {
        courseId: chapter.courseId,
        studentId: user.id
      }
    }) : null;

    const isOwner = user && chapter.course.instructorId === user.id;
    const isAdmin = user && user.role === 'ADMIN';

    // Only allow access to enrolled students or owner/admin
    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Enroll in the course to view this chapter.'
      });
    }

    // Get user's progress for this chapter
    let progress = null;
    if (user) {
      progress = await prisma.chapterProgress.findFirst({
        where: {
          studentId: user.id,
          chapterId: id
        }
      });
    }

    res.json({
      success: true,
      chapter: {
        ...chapter,
        progress
      }
    });
  } catch (error) {
    console.error('Get chapter by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chapter',
      error: error.message
    });
  }
};
