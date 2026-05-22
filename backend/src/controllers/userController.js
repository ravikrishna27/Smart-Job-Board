import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import AppError from '../utils/AppError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get user profile details
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  return apiResponse(res, 200, { data: user }, 'User profile fetched successfully');
});

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Fields allowed to be updated
  const {
    name,
    bio,
    skills,
    education,
    experience,
    companyName,
    companyWebsite,
    companyIndustry,
    companySize,
    companyDescription,
    companyLocation
  } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;
  if (education !== undefined) user.education = education;
  if (experience !== undefined) user.experience = experience;

  // Recruiter fields
  if (companyName !== undefined) user.companyName = companyName;
  if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
  if (companyIndustry !== undefined) user.companyIndustry = companyIndustry;
  if (companySize !== undefined) user.companySize = companySize;
  if (companyDescription !== undefined) user.companyDescription = companyDescription;
  if (companyLocation !== undefined) user.companyLocation = companyLocation;

  await user.save();

  return apiResponse(res, 200, { data: user }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/users/update-password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new passwords', 400));
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  return apiResponse(res, 200, null, 'Password updated successfully');
});

/**
 * @desc    Upload profile resume (Student only)
 * @route   POST /api/users/profile/resume
 * @access  Private (Student)
 */
export const uploadProfileResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a resume file', 400));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Construct URL for the locally uploaded file
  const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;
  
  user.resumeUrl = resumeUrl;
  user.resumeFileName = req.file.originalname;

  await user.save();

  return apiResponse(res, 200, { 
    data: {
      resumeUrl: user.resumeUrl,
      resumeFileName: user.resumeFileName
    }
  }, 'Resume uploaded successfully');
});

/**
 * @desc    Get all saved jobs for current user (Student only)
 * @route   GET /api/users/saved-jobs
 * @access  Private (Student)
 */
export const getSavedJobs = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedJobs',
    match: { isDeleted: false }
  });
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  return apiResponse(res, 200, { data: user.savedJobs }, 'Saved jobs fetched successfully');
});

/**
 * @desc    Save a job (Student only)
 * @route   POST /api/users/saved-jobs/:jobId
 * @access  Private (Student)
 */
export const saveJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job || job.isDeleted) {
    return next(new AppError('Job not found', 404));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Avoid duplicates
  if (user.savedJobs.includes(jobId)) {
    return apiResponse(res, 200, { data: user.savedJobs }, 'Job already saved');
  }

  user.savedJobs.push(jobId);
  await user.save();

  return apiResponse(res, 200, { data: user.savedJobs }, 'Job saved successfully');
});

/**
 * @desc    Unsave a job (Student only)
 * @route   DELETE /api/users/saved-jobs/:jobId
 * @access  Private (Student)
 */
export const unsaveJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
  await user.save();

  return apiResponse(res, 200, { data: user.savedJobs }, 'Job unsaved successfully');
});

/**
 * @desc    Get recruiter analytics (Recruiter only)
 * @route   GET /api/users/analytics
 * @access  Private (Recruiter)
 */
export const getRecruiterAnalytics = asyncHandler(async (req, res, next) => {
  const recruiterId = req.user._id;

  // Fetch recruiter's jobs
  const jobs = await Job.find({ postedBy: recruiterId, isDeleted: false });
  const jobIds = jobs.map(j => j._id);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'open').length;

  // Fetch applicants/applications
  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
  
  // Status breakdown
  const pendingCount = await Application.countDocuments({ job: { $in: jobIds }, status: 'pending' });
  const reviewedCount = await Application.countDocuments({ job: { $in: jobIds }, status: 'reviewed' });
  const shortlistedCount = await Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' });
  const rejectedCount = await Application.countDocuments({ job: { $in: jobIds }, status: 'rejected' });

  // Average ATS score
  const atsResult = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
  ]);
  const avgAtsScore = atsResult.length > 0 ? Math.round(atsResult[0].avgScore) : 0;

  // Top jobs by application count
  const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
    const count = await Application.countDocuments({ job: job._id });
    return {
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: job.status,
      createdAt: job.createdAt,
      applicantCount: count
    };
  }));

  const topJobs = [...jobsWithCounts]
    .sort((a, b) => b.applicantCount - a.applicantCount)
    .slice(0, 5);

  return apiResponse(res, 200, {
    data: {
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        avgAtsScore,
        shortlistedCount
      },
      funnel: {
        pending: pendingCount,
        reviewed: reviewedCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount
      },
      topJobs
    }
  }, 'Recruiter analytics fetched successfully');
});
