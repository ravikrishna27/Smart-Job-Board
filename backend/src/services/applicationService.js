import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { AppError } from '../utils/AppError.js';

class ApplicationService {
  /**
   * Apply to a job
   */
  async applyToJob(studentId, jobId, resumeData, coverLetter) {
    // 1. Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.isDeleted) throw new AppError('Job not found', 404);
    if (job.status !== 'open') throw new AppError('This job is no longer accepting applications', 400);

    // 2. Check if student already applied
    const existingApplication = await Application.findOne({ student: studentId, job: jobId });
    if (existingApplication) {
      throw new AppError('You have already applied to this job', 400);
    }

    // 3. Create application
    const application = await Application.create({
      student: studentId,
      job: jobId,
      resumeUrl: resumeData.url,
      resumePublicId: resumeData.public_id,
      resumeFileName: resumeData.originalName,
      resumeFileSize: resumeData.size,
      coverLetter
    });

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
    const application = await Application.findById(applicationId).populate('job', 'postedBy');
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
    return application;
  }
}

export const applicationService = new ApplicationService();
