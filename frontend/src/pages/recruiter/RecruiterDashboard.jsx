import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, Users, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { jobService } from '../../services/jobService';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getMyJobs();
        setJobs(response.data);
      } catch (error) {
        toast.error('Failed to load your jobs: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      const toastId = toast.loading('Deleting job...');
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter(job => job._id !== id));
        toast.success('Job deleted successfully', { id: toastId });
      } catch (error) {
        toast.error(getErrorMessage(error), { id: toastId });
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const toastId = toast.loading('Updating status...');
    try {
      await jobService.updateJobStatus(id, newStatus);
      setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
      toast.success(`Job marked as ${newStatus}`, { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Dashboard | Recruiter - Smart Job Board</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Overview of your hiring pipeline.</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="primary">Post a New Job</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Jobs" 
          value={isLoading ? '-' : jobs.filter(j => j.status === 'open').length.toString()} 
          icon={FileText} 
        />
        <StatsCard 
          title="Total Applicants" 
          value="0" 
          icon={Users} 
        />
        <StatsCard 
          title="Profile Views" 
          value="0" 
          icon={Eye} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Your Job Postings">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">You haven't posted any jobs yet.</p>
                <Link to="/recruiter/jobs/new">
                  <Button variant="outline">Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Job Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Posted On</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map(job => (
                      <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {job.title}
                          <div className="text-xs text-gray-500 font-normal">{job.location}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleStatusToggle(job._id, job.status)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title={`Mark as ${job.status === 'open' ? 'closed' : 'open'}`}>
                              <Eye size={18} />
                            </button>
                            <Link to={`/recruiter/jobs/edit/${job._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit Job">
                              <Edit size={18} />
                            </Link>
                            <Link to={`/jobs/${job.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Public Page">
                              <ExternalLink size={18} />
                            </Link>
                            <button onClick={() => handleDelete(job._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Job">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </div>
        
        <div className="space-y-6">
          <DashboardCard title="Recent Applicants">
            <div className="text-center py-8 text-gray-500">
              <p>No new applicants to review today.</p>
            </div>
          </DashboardCard>

          <DashboardCard title="Hiring Tips">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Write clearer job descriptions to attract better candidates.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Respond to applicants within 48 hours to maintain a strong employer brand.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Use skills assessments to filter candidates effectively.</p>
              </li>
            </ul>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
