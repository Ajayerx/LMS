import prisma from '../config/prisma.js';
import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';

// Generate PDF certificate
const generateCertificatePDF = async (studentName, courseTitle, instructorName, completionDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape'
      });

      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // Page dimensions
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Border
      doc.lineWidth(8);
      doc.strokeColor('#2563eb');
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

      // Inner border
      doc.lineWidth(2);
      doc.strokeColor('#60a5fa');
      doc.rect(45, 45, pageWidth - 90, pageHeight - 90).stroke();

      // Header
      doc.fontSize(12)
        .fillColor('#64748b')
        .text('LMS - Learning Management System', 0, 80, { align: 'center' });

      // Logo text
      doc.fontSize(48)
        .fillColor('#2563eb')
        .font('Helvetica-Bold')
        .text('LMS', 0, 110, { align: 'center' });

      // Certificate title
      doc.fontSize(36)
        .fillColor('#1e293b')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF COMPLETION', 0, 180, { align: 'center' });

      // Subtitle
      doc.fontSize(16)
        .fillColor('#64748b')
        .font('Helvetica')
        .text('This is to certify that', 0, 240, { align: 'center' });

      // Student name
      doc.fontSize(32)
        .fillColor('#1e293b')
        .font('Helvetica-Bold')
        .text(studentName, 0, 280, { align: 'center' });

      // Course completion text
      doc.fontSize(16)
        .fillColor('#64748b')
        .font('Helvetica')
        .text('has successfully completed the course', 0, 340, { align: 'center' });

      // Course title
      doc.fontSize(28)
        .fillColor('#2563eb')
        .font('Helvetica-Bold')
        .text(courseTitle, 0, 380, { align: 'center' });

      // Date and Instructor section
      const bottomY = 480;

      // Completion Date
      doc.fontSize(12)
        .fillColor('#64748b')
        .text('Completion Date', 150, bottomY, { align: 'left' });

      doc.fontSize(14)
        .fillColor('#1e293b')
        .font('Helvetica-Bold')
        .text(completionDate, 150, bottomY + 20, { align: 'left' });

      doc.lineWidth(1)
        .strokeColor('#94a3b8')
        .moveTo(150, bottomY + 45)
        .lineTo(320, bottomY + 45)
        .stroke();

      // Instructor
      doc.fontSize(12)
        .fillColor('#64748b')
        .font('Helvetica')
        .text('Instructor', pageWidth - 320, bottomY, { align: 'left' });

      doc.fontSize(14)
        .fillColor('#1e293b')
        .font('Helvetica-Bold')
        .text(instructorName, pageWidth - 320, bottomY + 20, { align: 'left' });

      doc.lineWidth(1)
        .strokeColor('#94a3b8')
        .moveTo(pageWidth - 320, bottomY + 45)
        .lineTo(pageWidth - 150, bottomY + 45)
        .stroke();

      // Certificate ID
      const certId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      doc.fontSize(10)
        .fillColor('#94a3b8')
        .font('Helvetica')
        .text(`Certificate ID: ${certId}`, 0, pageHeight - 80, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Upload certificate to Cloudinary
const uploadCertificateToCloudinary = async (pdfBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'lms/certificates',
        public_id: fileName,
        format: 'pdf',
        type: 'upload'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(pdfBuffer);
  });
};

// Generate and save certificate
export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check enrollment and progress
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            instructor: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Verify 100% progress
    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course must be 100% complete to generate certificate',
        currentProgress: enrollment.progress
      });
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (existingCertificate) {
      return res.json({
        success: true,
        message: 'Certificate already exists',
        certificate: existingCertificate
      });
    }

    // Get student name
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true }
    });

    // Generate PDF
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const pdfBuffer = await generateCertificatePDF(
      student.name,
      enrollment.course.title,
      enrollment.course.instructor.name,
      completionDate
    );

    // Generate filename
    const fileName = `cert-${studentId}-${courseId}-${Date.now()}`;

    // Upload to Cloudinary
    const certificateUrl = await uploadCertificateToCloudinary(pdfBuffer, fileName);

    // Save certificate to database
    const certificate = await prisma.certificate.create({
      data: {
        studentId,
        courseId,
        certificateUrl,
        issuedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: {
        id: certificate.id,
        certificateUrl: certificate.certificateUrl,
        issuedAt: certificate.issuedAt,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title
        }
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
};

// Get all certificates for a student
export const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;

    const certificates = await prisma.certificate.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            instructor: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    });

    res.json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificates',
      error: error.message
    });
  }
};

// Get certificate details
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            instructor: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Only allow owner or admin to view
    const isOwner = certificate.studentId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificate',
      error: error.message
    });
  }
};

// Verify certificate (public endpoint)
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await prisma.certificate.findFirst({
      where: { id: certificateId },
      include: {
        student: {
          select: { name: true }
        },
        course: {
          select: {
            title: true,
            instructor: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.json({
      success: true,
      verified: true,
      certificate: {
        id: certificate.id,
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        instructorName: certificate.course.instructor.name,
        issuedAt: certificate.issuedAt
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying certificate',
      error: error.message
    });
  }
};
