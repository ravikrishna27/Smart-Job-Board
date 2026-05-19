import { z } from 'zod';
import AppError from '../utils/AppError.js';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['student', 'recruiter']).optional()
});

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required")
});

export const validateRegister = (req, res, next) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => err.message).join(', ');
      return next(new AppError(`Validation Failed: ${formattedErrors}`, 400));
    }
    next(error);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => err.message).join(', ');
      return next(new AppError(`Validation Failed: ${formattedErrors}`, 400));
    }
    next(error);
  }
};
