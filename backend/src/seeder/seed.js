import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config({ path: '../../.env' }); // Adjust path to point to backend/.env

const mockJobs = [
  {
    title: "Senior Frontend Engineer",
    company: "TechNova",
    location: "San Francisco, CA (Hybrid)",
    salary: 145000,
    jobType: "Full-Time",
    experienceLevel: "Senior Level",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    description: "Join our core product team to build the next generation of our SaaS platform.",
    isRemote: false
  },
  {
    title: "Backend Developer",
    company: "DataStack",
    location: "Remote",
    salary: 130000,
    jobType: "Full-Time",
    experienceLevel: "Mid Level",
    skills: ["Node.js", "Express", "MongoDB"],
    description: "We are looking for a Node.js developer to scale our API infrastructure.",
    isRemote: true
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "New York, NY",
    salary: 95000,
    jobType: "Full-Time",
    experienceLevel: "Mid Level",
    skills: ["Figma", "Prototyping", "Wireframing"],
    description: "Help us design beautiful interfaces for our mobile applications.",
    isRemote: false
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-job-board');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Job.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing data.');

    // Create a mock recruiter user to own the jobs
    const recruiter = await User.create({
      name: 'Admin Recruiter',
      email: 'admin@company.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'recruiter'
    });

    console.log('Created mock recruiter.');

    // Attach recruiter ID to mock jobs
    const jobsToInsert = mockJobs.map(job => ({
      ...job,
      postedBy: recruiter._id.toString()
    }));

    await Job.insertMany(jobsToInsert);
    console.log('Mock jobs inserted.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
