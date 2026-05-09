import { jobService } from '../services/jobService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private (Recruiter)
 */
export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user._id);
  return apiResponse(res, 201, { data: job }, 'Job created successfully');
});

/**
 * @desc    Get all jobs (with filtering, sorting, pagination)
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.fetchJobs(req.query);
  
  return apiResponse(res, 200, {
    count: result.count,
    totalCount: result.totalCount,
    page: result.page,
    totalPages: result.totalPages,
    data: result.jobs
  }, 'Jobs fetched successfully');
});

/**
 * @desc    Get recruiter's jobs
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Recruiter)
 */
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getMyJobs(req.user._id);
  return apiResponse(res, 200, { data: jobs }, 'My jobs fetched successfully');
});

/**
 * @desc    Get a single job by ID or slug
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  return apiResponse(res, 200, { data: job }, 'Job fetched successfully');
});

/**
 * @desc    Update a job by ID
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  return apiResponse(res, 200, { data: job }, 'Job updated successfully');
});

/**
 * @desc    Update a job status by ID
 * @route   PATCH /api/jobs/:id/status
 * @access  Private (Recruiter)
 */
export const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const job = await jobService.updateJobStatus(req.params.id, req.user._id, status);
  return apiResponse(res, 200, { data: job }, 'Job status updated successfully');
});

/**
 * @desc    Delete a job by ID
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id);
  return apiResponse(res, 200, null, 'Job deleted successfully');
});
