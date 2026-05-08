import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, // Creates a MongoDB index ensuring email uniqueness
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // IMPORTANT: Never return the password by default in queries
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random' // Placeholder avatar
  },
  skills: {
    type: [String],
    default: []
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for createdAt as suggested for analytics/sorting
userSchema.index({ createdAt: -1 });

/**
 * Pre-save middleware to hash password before saving to MongoDB
 */
userSchema.pre('save', async function(next) {
  // Only run this function if password was modified (not on other update operations)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password with cost factor of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method to compare an entered password with the hashed password in the database
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
