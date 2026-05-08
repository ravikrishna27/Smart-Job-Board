import Job from '../models/Job.js';

class JobService {
  /**
   * Create a new job in the database
   */
  async createJob(jobData) {
    const job = await Job.create(jobData);
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

    // 1. Build the query object
    const filter = {};

    if (keyword) {
      // Text search using the compound text index we created in the model
      filter.$text = { $search: keyword };
    }

    if (location) {
      // Case-insensitive regex search for location
      filter.location = { $regex: location, $options: 'i' };
    }

    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // 2. Build the Mongoose Query
    let mongooseQuery = Job.find(filter).select('-__v'); // Exclude the internal Mongoose version key

    // 3. Sorting
    if (sort) {
      // e.g., sort=-salary,createdAt -> split by comma, join by space -> "-salary createdAt"
      const sortBy = sort.split(',').join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      // Default sort by newest
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
   * Fetch a single job by ID
   */
  async getJobById(id) {
    const job = await Job.findById(id).select('-__v');
    if (!job) throw new Error('Job not found');
    return job;
  }

  /**
   * Update a job by ID
   */
  async updateJob(id, updateData) {
    const job = await Job.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Returns the new document and runs model validation
    ).select('-__v');
    
    if (!job) throw new Error('Job not found');
    return job;
  }

  /**
   * Delete a job by ID
   */
  async deleteJob(id) {
    const job = await Job.findByIdAndDelete(id);
    if (!job) throw new Error('Job not found');
    return job;
  }
}

export const jobService = new JobService();
