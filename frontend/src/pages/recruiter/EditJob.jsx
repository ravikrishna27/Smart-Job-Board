import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { jobService } from '../../../services/jobService';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import JobForm from '../../../components/jobs/JobForm';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJobById(id);
        setInitialData(response.data);
      } catch (error) {
        toast.error('Failed to load job: ' + getErrorMessage(error));
        navigate('/recruiter/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating job...');
    
    try {
      await jobService.updateJob(initialData._id || initialData.id, data);
      toast.success('Job updated successfully!', { id: toastId });
      navigate('/recruiter/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading job details...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Edit Job - Smart Job Board</title>
      </Helmet>

      <div className="container-custom max-w-4xl">
        <div className="mb-6">
          <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job: {initialData?.title}</h1>
          <p className="text-gray-600 mt-2">Update the details for this job posting.</p>
        </div>

        <JobForm 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitText="Update Job" 
        />
      </div>
    </div>
  );
}
