import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.number().min(0, "Salary cannot be negative"),
  jobType: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Internship']),
  experienceLevel: z.enum(['Entry Level', 'Mid Level', 'Senior Level', 'Executive']),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  isRemote: z.boolean().optional(),
  postedBy: z.string().min(1, "PostedBy is required")
});

export const validateJob = (req, res, next) => {
  try {
    // parse throws an error if validation fails
    req.body = jobSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors nicely
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      res.status(400);
      return next(new Error(`Validation Failed: ${JSON.stringify(formattedErrors)}`));
    }
    next(error);
  }
};
