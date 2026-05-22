import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, MapPin, DollarSign, Calendar, Bookmark, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import DashboardCard from '../../components/dashboard/StatsCard';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await userService.getSavedJobs();
        setSavedJobs(response.data || []);
      } catch (error) {
        toast.error('Failed to load saved jobs: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await userService.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      toast.info('Job removed from saved list.');
    } catch (error) {
      toast.error('Failed to unsave job: ' + getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Saved Jobs | Student Dashboard - Smart Job Board</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-500 mt-1">Review and manage the positions you saved for later.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-44 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 max-w-xl mx-auto shadow-sm">
          <Bookmark className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5] mb-3" />
          <p className="font-semibold text-gray-700">Your saved jobs list is empty</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Explore career opportunities and bookmark listings to keep track of them here.</p>
          <Link to="/jobs">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm shadow-blue-500/10">
              Browse Open Jobs
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <div 
              key={job._id}
              className="bg-white border border-gray-100 hover:border-blue-200 transition-all rounded-2xl p-5 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm flex-shrink-0">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{job.company}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUnsave(job._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Job Metadata */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-gray-400" /> ${job.salary.toLocaleString()}/yr</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-gray-400" /> {job.jobType}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-0.5 text-[10px] font-medium bg-gray-50 border border-gray-100 rounded text-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-50 border border-gray-100 rounded text-gray-400">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                  job.status === 'open' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}>
                  {job.status}
                </span>

                <Link to={`/jobs/${job._id}`}>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
