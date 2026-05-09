import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, Star } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../services/applicationService';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getMyApplications();
        setApplications(response.data);
      } catch (error) {
        toast.error('Failed to load applications: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700'; // pending
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Dashboard | Student - Smart Job Board</title>
      </Helmet>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's what's happening with your job search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Applied Jobs" 
          value={isLoading ? '-' : applications.length.toString()} 
          icon={Briefcase} 
        />
        <StatsCard 
          title="Saved Jobs" 
          value="0" 
          icon={Bookmark} 
        />
        <StatsCard 
          title="Profile Views" 
          value="0" 
          icon={Star} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Your Applications">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't applied to any jobs yet.</p>
                <Link to="/jobs">
                  <button className="mt-4 text-blue-600 font-medium hover:text-blue-700">Browse Jobs</button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Role & Company</th>
                      <th className="px-4 py-3">Applied On</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {app.job.title}
                          <div className="text-xs text-gray-500 font-normal">{app.job.company}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
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
          <DashboardCard title="Profile Completion">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-gray-900">75%</span>
              </div>
              <p className="text-sm text-gray-600 text-center">Complete your profile to increase your chances of being noticed.</p>
              <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Complete Profile
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
