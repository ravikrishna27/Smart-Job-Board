import { useMemo } from 'react';
import { mockJobs } from '../../data/jobs';
import JobCard from './JobCard';

export default function RelatedJobs({ currentJob }) {
  const relatedJobs = useMemo(() => {
    if (!currentJob) return [];

    return mockJobs
      .filter(job => job.id !== currentJob.id) // Exclude current job
      .map(job => {
        let score = 0;
        // Algorithm: Calculate relevance score based on overlap
        if (job.category === currentJob.category) score += 3;
        if (job.experienceLevel === currentJob.experienceLevel) score += 2;
        if (job.location === currentJob.location) score += 1;
        
        // Count overlapping skills
        const sharedSkills = job.skills.filter(s => currentJob.skills.includes(s));
        score += sharedSkills.length;

        return { ...job, score };
      })
      .filter(job => job.score > 0) // Only keep jobs with at least some relevance
      .sort((a, b) => b.score - a.score) // Sort by highest score first
      .slice(0, 4); // Take top 4
  }, [currentJob]);

  if (relatedJobs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
      <div className="space-y-4">
        {relatedJobs.map(job => (
          // We can use JobCard, or a smaller version. JobCard handles its own layout well.
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
