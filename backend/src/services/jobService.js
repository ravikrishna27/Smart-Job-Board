import Job from '../models/Job.js';
import AppError from '../utils/AppError.js';

class JobService {
  /**
   * Create a new job in the database
   */
  async createJob(jobData, userId) {
    // Attach the recruiter ID before saving
    const job = await Job.create({
      ...jobData,
      postedBy: userId
    });
    return job;
  }

  /**
   * Fetch jobs with advanced filtering, sorting, and pagination
   */
  async fetchJobs(query) {
    const { 
      keyword, 
      location, 
      jobType, 
      experienceLevel, 
      sort, 
      page = 1, 
      limit = 10 
    } = query;

    // 1. Build the query object (excluding soft deleted jobs and only open jobs)
    const filter = {
      isDeleted: { $ne: true },
      status: 'open'
    };

    if (keyword) {
      filter.$text = { $search: keyword };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // 2. Build the Mongoose Query
    let mongooseQuery = Job.find(filter)
      .select('-__v')
      .populate('postedBy', 'name email avatar'); // Add recruiter population

    // 3. Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // 4. Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    // 5. Execute queries in parallel for performance
    const [jobs, totalCount] = await Promise.all([
      mongooseQuery,
      Job.countDocuments(filter)
    ]);

    return {
      jobs,
      count: jobs.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum)
    };
  }

  /**
   * Fetch jobs posted by a specific recruiter
   */
  async getMyJobs(userId) {
    const jobs = await Job.find({ 
      postedBy: userId,
      isDeleted: { $ne: true } 
    }).sort('-createdAt').select('-__v');
    return jobs;
  }

  /**
   * Fetch a single job by ID or Slug
   */
  async getJobById(idOrSlug) {
    // Check if the param is a valid ObjectId, otherwise query by slug
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    
    // Do not return soft deleted jobs
    query.isDeleted = { $ne: true };

    const job = await Job.findOne(query)
      .select('-__v')
      .populate('postedBy', 'name email avatar');
      
    if (!job) throw new AppError('Job not found', 404);
    return job;
  }

  /**
   * Update a job by ID (Requires Ownership)
   */
  async updateJob(id, userId, updateData) {
    const job = await Job.findById(id);
    if (!job || job.isDeleted) throw new AppError('Job not found', 404);

    // Verify ownership
    if (job.postedBy.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to update this job', 403);
    }

    // Use Object.assign to update fields, then save to trigger pre-save hooks (like slug update)
    Object.assign(job, updateData);
    await job.save();

    return job;
  }

  /**
   * Partially update a job's status (Requires Ownership)
   */
  async updateJobStatus(id, userId, status) {
    const job = await Job.findById(id);
    if (!job || job.isDeleted) throw new AppError('Job not found', 404);

    // Verify ownership
    if (job.postedBy.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to update this job', 403);
    }

    job.status = status;
    await job.save();

    return job;
  }

  /**
   * Soft Delete a job by ID (Requires Ownership)
   */
  async deleteJob(id, userId) {
    const job = await Job.findById(id);
    if (!job || job.isDeleted) throw new AppError('Job not found', 404);

    // Verify ownership
    if (job.postedBy.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to delete this job', 403);
    }

    // Soft delete
    job.isDeleted = true;
    await job.save();

    return job;
  }
}

export const jobService = new JobService();
