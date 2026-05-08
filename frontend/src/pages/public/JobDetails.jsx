import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { ROUTES } from '../../routes/routePaths';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { toast } from 'sonner';

import JobHeader from '../../components/jobs/JobHeader';
import JobDescription from '../../components/jobs/JobDescription';
import RelatedJobs from '../../components/jobs/RelatedJobs';
import ApplyModal from '../../components/jobs/ApplyModal';
import NotFound from './NotFound';

export default function JobDetails() {
  const { id } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await jobService.getJobById(id);
        setJob(response.data);
      } catch (err) {
        setError(true);
        toast.error('Failed to load job details: ' + getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return <NotFound />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Helmet>
        <title>{job.title} at {job.company} - Smart Job Board</title>
        <meta name="description" content={`Apply for ${job.title} at ${job.company} located in ${job.location}.`} />
      </Helmet>

      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Link to={ROUTES.JOBS} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to all jobs
          </Link>
        </div>
      </div>

      <JobHeader job={job} onApplyClick={() => setIsApplyModalOpen(true)} />

      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content: Description */}
          <div className="lg:col-span-2">
            <JobDescription job={job} />
          </div>

          {/* Sidebar: Related Jobs */}
          <div className="space-y-6">
            <RelatedJobs currentJob={job} />
          </div>

        </div>
      </div>

      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        job={job} 
      />
    </div>
  );
}
