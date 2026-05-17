import Application from '../models/Application.js';
import Job from '../models/Job.js';
import AppError from '../utils/AppError.js';
import { notificationService } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

class ApplicationService {
  /**
   * Apply to a job
   */
  async applyToJob(studentId, jobId, resumeData, coverLetter, user) {
    // 1. Check if job exists and is open
    const job = await Job.findById(jobId).populate('postedBy', 'name email');
    if (!job || job.isDeleted) throw new AppError('Job not found', 404);
    if (job.status !== 'open') throw new AppError('This job is no longer accepting applications', 400);

    // 2. Check if student already applied
    const existingApplication = await Application.findOne({ student: studentId, job: jobId });
    if (existingApplication) {
      throw new AppError('You have already applied to this job', 400);
    }

    // 3. Make synchronous call to Python AI Microservice
    let aiData = { atsScore: 0, extractedSkills: [], aiSummary: "" };
    try {
      // In production, the Python URL should be in env
      const pythonAiUrl = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';
      
      const response = await fetch(`${pythonAiUrl}/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_url: resumeData.url,
          job_skills: job.skills.map(s => s.name || s) // handle both array of strings and array of objects
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        aiData = {
          atsScore: result.ats_score,
          extractedSkills: result.extracted_skills,
          aiSummary: result.ai_summary
        };
      } else {
        console.warn('AI Parsing Service returned an error:', await response.text());
      }
    } catch (error) {
      console.warn('AI Parsing Service is unreachable or failed. Falling back to basic application. Error:', error.message);
    }

    // 4. Create application
    const application = await Application.create({
      student: studentId,
      job: jobId,
      resumeUrl: resumeData.url,
      resumePublicId: resumeData.public_id,
      resumeFileName: resumeData.originalName,
      resumeFileSize: resumeData.size,
      coverLetter,
      atsScore: aiData.atsScore,
      extractedSkills: aiData.extractedSkills,
      aiSummary: aiData.aiSummary
    });

    // 5. Send Real-Time Notification to Recruiter
    const studentName = user ? user.name : 'A student';
    await notificationService.createNotification(
      job.postedBy._id,
      NOTIFICATION_TYPES.APPLICATION_RECEIVED,
      `${studentName} applied for your ${job.title} position.`,
      {
        applicationId: application._id,
        jobSlug: job.slug,
        recruiterId: job.postedBy._id
      }
    );

    return application;
  }

  /**
   * Get applications for a specific student
   */
  async getStudentApplications(studentId) {
    return await Application.find({ student: studentId })
      .populate({
        path: 'job',
        select: 'title company location status',
      })
      .sort('-appliedAt');
  }

  /**
   * Get all applicants for a specific job (Recruiter only)
   */
  async getJobApplicants(jobId, recruiterId) {
    // Verify recruiter owns the job
    const job = await Job.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);
    if (job.postedBy.toString() !== recruiterId.toString()) {
      throw new AppError('Unauthorized access to applicants', 403);
    }

    return await Application.find({ job: jobId })
      .populate('student', 'name email avatar')
      .sort('-appliedAt');
  }

  /**
   * Update application status (Recruiter only)
   */
  async updateApplicationStatus(applicationId, recruiterId, status) {
    const application = await Application.findById(applicationId).populate('job', 'postedBy title slug');
    if (!application) throw new AppError('Application not found', 404);

    // Verify recruiter owns the job
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      throw new AppError('Unauthorized to update this application', 403);
    }

    application.status = status;
    
    // Update timeline
    if (status === 'reviewed') application.reviewedAt = new Date();
    if (status === 'shortlisted') application.shortlistedAt = new Date();
    if (status === 'rejected') application.rejectedAt = new Date();

    await application.save();

    // Emit Real-Time Notification to Student
    await notificationService.createNotification(
      application.student,
      NOTIFICATION_TYPES.APPLICATION_STATUS_UPDATE,
      `Your application for ${application.job.title} was marked as ${status}.`,
      {
        applicationId: application._id,
        jobSlug: application.job.slug
      }
    );

    return application;
  }
}

export const applicationService = new ApplicationService();
