import { applicationService } from '../services/applicationService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Student)
 */
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  
  if (!req.file) {
    throw new AppError('Resume PDF is required', 400);
  }

  const resumeData = {
    url: req.file.path,
    public_id: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  };

  const application = await applicationService.applyToJob(req.user._id, jobId, resumeData, coverLetter);
  return apiResponse(res, 201, { data: application }, 'Application submitted successfully');
});

/**
 * @desc    Get current student's applications
 * @route   GET /api/applications/me
 * @access  Private (Student)
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getStudentApplications(req.user._id);
  return apiResponse(res, 200, { data: applications }, 'Applications fetched successfully');
});

/**
 * @desc    Get applicants for a specific job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter)
 */
export const getJobApplicants = asyncHandler(async (req, res) => {
  const applicants = await applicationService.getJobApplicants(req.params.jobId, req.user._id);
  return apiResponse(res, 200, { data: applicants }, 'Applicants fetched successfully');
});

/**
 * @desc    Update application status
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Recruiter)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await applicationService.updateApplicationStatus(req.params.id, req.user._id, status);
  return apiResponse(res, 200, { data: application }, 'Application status updated successfully');
});
