import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { jobService } from '../../../services/jobService';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import JobForm from '../../../components/jobs/JobForm';

export default function PostJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Posting job...');
    
    try {
      await jobService.createJob(data);
      toast.success('Job posted successfully!', { id: toastId });
      navigate('/recruiter/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Post a New Job - Smart Job Board</title>
      </Helmet>

      <div className="container-custom max-w-4xl">
        <div className="mb-6">
          <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2">Fill out the details below to create a new job posting.</p>
        </div>

        <JobForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitText="Post Job" 
        />
      </div>
    </div>
  );
}
