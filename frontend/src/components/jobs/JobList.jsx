import JobCard from './JobCard';

export default function JobList({ jobs }) {
  return (
    <div>
      <div className="mb-6 text-gray-600 font-medium">
        Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
