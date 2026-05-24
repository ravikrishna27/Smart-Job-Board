import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import aiClient from '../utils/aiClient.js';
import AppError from '../utils/AppError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get explainable job recommendations for the logged-in student
 * @route   GET /api/users/recommendations
 * @access  Private (Student)
 */
export const getJobRecommendations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // 1. Gather student data
  const user = await User.findById(userId).populate('savedJobs');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Gather past applications history
  const applications = await Application.find({ student: userId }).populate('job');
  
  const appliedJobTitles = [];
  const appliedJobDescriptions = [];
  applications.forEach(app => {
    if (app.job) {
      appliedJobTitles.push(app.job.title || '');
      appliedJobDescriptions.push(app.job.description || '');
    }
  });

  const savedJobTitles = [];
  const savedJobDescriptions = [];
  user.savedJobs.forEach(job => {
    if (job) {
      savedJobTitles.push(job.title || '');
      savedJobDescriptions.push(job.description || '');
    }
  });

  const studentProfile = {
    skills: user.skills || [],
    appliedJobTitles,
    appliedJobDescriptions,
    savedJobTitles,
    savedJobDescriptions
  };

  // 2. Fetch all active open job postings
  const allJobs = await Job.find({ status: 'open', isDeleted: false });

  // 3. Query Python AI Service
  try {
    const aiResponse = await aiClient.post('/ai/recommend-jobs', {
      student_profile: studentProfile,
      all_jobs: allJobs
    });
    
    return apiResponse(res, 200, { data: aiResponse.data.data }, 'Personalized recommendations fetched successfully');
  } catch (error) {
    console.error('[RECOMMENDATIONS] AI microservice error:', error.message);
    // Graceful fallback: return unranked jobs if AI service fails
    const fallbackData = allJobs.map(job => ({
      job,
      score: 50,
      reasons: ['High popularity match'],
      breakdown: { skillsScore: 50, titleScore: 50, historyScore: 50 },
      industry: job.companyIndustry || 'General'
    }));
    return apiResponse(res, 200, { data: fallbackData, fallback: true }, 'AI engine offline, returning default matching list');
  }
});

/**
 * @desc    Get hybrid semantic search results
 * @route   POST /api/jobs/search/semantic
 * @access  Public
 */
export const semanticSearchJobs = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return next(new AppError('Search query is required', 400));
  }

  // Fetch all open active jobs
  const allJobs = await Job.find({ status: 'open', isDeleted: false });

  try {
    const aiResponse = await aiClient.post('/ai/semantic-search', {
      query: query.trim(),
      all_jobs: allJobs
    });
    
    return apiResponse(res, 200, { data: aiResponse.data.data }, 'Semantic search completed successfully');
  } catch (error) {
    console.error('[SEMANTIC SEARCH] AI service failed, falling back to standard filter:', error.message);
    // Fallback: search matches by regex
    const regex = new RegExp(query, 'i');
    const fallbackJobs = allJobs.filter(j => regex.test(j.title) || regex.test(j.description));
    const fallbackData = fallbackJobs.map(job => ({
      job,
      score: 60,
      cosine_sim: 60,
      skill_overlap: 50
    }));
    return apiResponse(res, 200, { data: fallbackData, fallback: true }, 'AI engine offline, returning partial keyword search');
  }
});

/**
 * @desc    Get ATS skill gap analysis for current student
 * @route   GET /api/users/student-analytics
 * @access  Private (Student)
 */
export const getStudentSkillGap = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Gather target skills from applications
  const applications = await Application.find({ student: userId }).populate('job');
  const appliedJobsRequiredSkills = applications
    .filter(app => app.job && app.job.skills)
    .map(app => app.job.skills);

  try {
    const aiResponse = await aiClient.post('/ai/skill-gap', {
      student_skills: user.skills || [],
      applied_jobs_required_skills: appliedJobsRequiredSkills
    });

    return apiResponse(res, 200, { data: aiResponse.data.data }, 'Skill gap analysis compiled successfully');
  } catch (error) {
    console.error('[SKILL GAP] AI service failed:', error.message);
    return next(new AppError('AI analytics service is currently unavailable. Please try again shortly.', 500));
  }
});

/**
 * @desc    Get recruiter skill supply vs demand shortages report
 * @route   GET /api/users/recruiter-analytics-advanced
 * @access  Private (Recruiter)
 */
export const getRecruiterSkillTrends = asyncHandler(async (req, res, next) => {
  const recruiterId = req.user._id;

  // 1. Gather recruiter jobs
  const recruiterJobs = await Job.find({ postedBy: recruiterId, isDeleted: false });
  const jobIds = recruiterJobs.map(j => j._id);

  // 2. Gather applicants profiles
  const applications = await Application.find({ job: { $in: jobIds } }).populate('student');
  const applicantsProfiles = [];
  
  // Deduplicate candidates
  const candidateIds = new Set();
  applications.forEach(app => {
    if (app.student && !candidateIds.has(app.student._id.toString())) {
      candidateIds.add(app.student._id.toString());
      applicantsProfiles.push({
        name: app.student.name || 'Candidate',
        skills: app.student.skills || []
      });
    }
  });

  try {
    const aiResponse = await aiClient.post('/ai/recruiter-skill-trends', {
      recruiter_jobs: recruiterJobs,
      applicants_profiles: applicantsProfiles
    });

    return apiResponse(res, 200, { data: aiResponse.data.data }, 'Talent supply and shortage report generated');
  } catch (error) {
    console.error('[RECRUITER TRENDS] AI service failed:', error.message);
    return next(new AppError('Talent analysis engine is currently unavailable.', 500));
  }
});
