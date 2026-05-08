import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters'],
    index: true // Helps with keyword searching
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    index: true // Helps with location filtering
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
      message: '{VALUE} is not a supported job type'
    },
    index: true
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      message: '{VALUE} is not a supported experience level'
    },
    index: true
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'A job must require at least one skill'
    },
    index: true // Helps with finding jobs by skill
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  isRemote: {
    type: Boolean,
    default: false,
    index: true
  },
  postedBy: {
    // For now, this is just a string. Later it will be:
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index for complex searches
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
