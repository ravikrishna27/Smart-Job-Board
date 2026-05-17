import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume is required']
  },
  resumePublicId: {
    type: String,
    required: true // Storing public_id to make cloud deletion easy later
  },
  resumeFileName: {
    type: String
  },
  resumeFileSize: {
    type: Number
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  // Timeline fields for advanced tracking
  reviewedAt: {
    type: Date
  },
  shortlistedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  // AI Parsing Fields
  atsScore: {
    type: Number,
    default: 0
  },
  extractedSkills: [{
    type: String
  }],
  aiSummary: {
    type: String
  }
}, {
  timestamps: true
});

// Enforce one application per student per job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
