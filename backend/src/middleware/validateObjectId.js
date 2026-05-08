import mongoose from 'mongoose';

/**
 * Middleware to validate if the ID parameter in the route is a valid MongoDB ObjectId.
 * Prevents Mongoose from throwing a nasty CastError.
 */
export const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('Invalid ID format');
    res.status(400); // 400 Bad Request
    return next(error);
  }
  next();
};
