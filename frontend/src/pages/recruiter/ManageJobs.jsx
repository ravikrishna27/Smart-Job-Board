import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, Users, Eye, Edit, Trash2, ExternalLink, Search, Plus, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { jobService } from '../../services/jobService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Button from '../../components/common/Button';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data || []);
    } catch (error) {
      toast.error('Failed to load your jobs: ' + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Manage Jobs | Recruiter Dashboard - Smart Job Board</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-500 mt-1">Review and manage all your active and closed job postings.</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="primary" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Post a New Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-1">
          {['all', 'open', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status} Listings
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <DashboardCard title="Your Job Postings">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">Loading jobs list...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5] mb-3" />
            <p className="font-semibold text-gray-700">No job postings found</p>
            <p className="text-sm text-gray-400 mt-1">Get started by creating your first hiring position.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Job Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Posted On</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {job.title}
                      <div className="text-xs text-gray-400 font-normal flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> ${job.salary.toLocaleString()}/yr</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        job.status === 'open' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-gray-50 text-gray-700 border-gray-100'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {job.applicantCount || 0}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/recruiter/jobs/${job._id}/applicants`} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" 
                          title="View Applicants"
                        >
                          <Users size={16} />
                        </Link>
                        <button 
                          onClick={() => handleStatusToggle(job._id, job.status)} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" 
                          title={`Mark as ${job.status === 'open' ? 'closed' : 'open'}`}
                        >
                          <Eye size={16} />
                        </button>
                        <Link 
                          to={`/recruiter/jobs/edit/${job._id}`} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" 
                          title="Edit Job"
                        >
                          <Edit size={16} />
                        </Link>
                        <Link 
                          to={`/jobs/${job.slug}`} 
                          target="_blank" 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" 
                          title="View Public Page"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(job._id)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
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
  );
}
