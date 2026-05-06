import { mockJobs } from '../../data/jobs';
import SectionTitle from '../common/SectionTitle';
import JobCard from '../jobs/JobCard';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

export default function FeaturedJobs() {
  // Display only the first 6 jobs for the home page
  const featuredJobs = mockJobs.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-10">
          <SectionTitle 
            title="Featured Jobs" 
            subtitle="Explore our hand-picked jobs from top companies."
          />
          <div className="hidden md:block pb-10">
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              View All Jobs <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" className="w-full justify-center">
            View All Jobs <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
