import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, Star, Sparkles, RefreshCw, Award, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../services/applicationService';
import { recommendationService } from '../../services/recommendationService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Button from '../../components/common/Button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const appResponse = await applicationService.getMyApplications();
      setApplications(appResponse.data || []);
    } catch (error) {
      toast.error('Failed to load applications: ' + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsRecsLoading(true);
    try {
      const recResponse = await recommendationService.getRecommendations();
      setRecommendations(recResponse.data || []);
    } catch (error) {
      console.error('[DASHBOARD] Recommendations fetch failed:', error.message);
    } finally {
      setIsRecsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRecommendations();
  }, []);

  const handleRefreshRecommendations = () => {
    setIsRefreshing(true);
    toast.loading('Regenerating AI job matches...', { id: 'refresh-recs' });
    fetchRecommendations().then(() => {
      toast.success('AI recommendations refreshed', { id: 'refresh-recs' });
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // pending
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>Student Dashboard | Smart Job Board</title>
      </Helmet>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, {user?.name}. Here's what's happening with your career search.</p>
        </div>
        <Link to="/jobs">
          <Button variant="primary">Browse All Jobs</Button>
        </Link>
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
          value={user?.savedJobs?.length?.toString() || "0"} 
          icon={Bookmark} 
        />
        <StatsCard 
          title="Profile Views" 
          value={isLoading ? '-' : Math.floor(applications.length * 1.5).toString()} 
          icon={Star} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side (Applications & Recommendations) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Recommended Jobs Section */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="text-blue-600 animate-pulse" size={18} />
                AI Recommended For You
              </h3>
              <button
                onClick={handleRefreshRecommendations}
                disabled={isRefreshing || isRecsLoading}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                title="Refresh AI suggestions"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Re-scoring...' : 'Refresh suggestions'}
              </button>
            </div>

            {isRecsLoading ? (
              <div className="text-center py-10 text-gray-400 text-xs font-semibold animate-pulse">
                Assembling semantic job recommendations...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs font-semibold">
                Add skills to your Student Profile to receive intelligent, explainable recommendations.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.slice(0, 4).map((rec, idx) => {
                  const job = rec.job || {};
                  return (
                    <div 
                      key={job._id || idx} 
                      className="border border-gray-100/80 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/20 bg-gray-50/20 rounded-xl p-4 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-gray-900 truncate flex-1">{job.title}</h4>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                            {rec.score}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-semibold">{job.company} • {job.location}</p>
                        
                        {/* Explainable match reasons */}
                        <div className="space-y-1.5 pt-2">
                          {rec.reasons?.map((reason, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200/50 px-2 py-0.5 rounded-md"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-auto flex items-center justify-between text-[10px] font-bold">
                        <span className="text-gray-400 capitalize">{job.companyIndustry || 'General'}</span>
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5"
                        >
                          Details <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Applications list */}
          <DashboardCard title="Your Applications">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-xs font-medium text-gray-400">You haven't applied to any jobs yet.</p>
                <Link to="/jobs">
                  <button className="mt-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-colors cursor-pointer">
                    Browse Jobs
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg text-xs font-bold uppercase tracking-wider">Role & Company</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Applied On</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg text-xs font-bold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {app.job?.title || 'Unknown Position'}
                          <div className="text-[10px] text-gray-500 font-normal mt-0.5">{app.job?.company || 'Recruiter'}</div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-500 font-medium">
                          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusColor(app.status)}`}>
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
        
        {/* Right Side Cards */}
        <div className="space-y-6">
          {/* AI Skill Gap Analytics Promotion */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-5 text-white shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent)] pointer-events-none"></div>
            <div className="relative z-10 space-y-3">
              <div className="bg-white/10 p-2 rounded-xl w-10 h-10 flex items-center justify-center border border-white/20">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">AI Skill Gap Analysis</h4>
                <p className="text-blue-100 text-xs mt-1 leading-relaxed">
                  Analyze your tech stack against aggregate job metrics to discover missing keywords.
                </p>
              </div>
              <Link to="/student/dashboard/analytics" className="inline-block pt-1 w-full">
                <button className="w-full bg-white hover:bg-blue-50 active:scale-95 text-blue-700 font-bold rounded-xl text-xs py-2.5 shadow-sm transition-all cursor-pointer">
                  View Skill Gaps
                </button>
              </Link>
            </div>
          </div>

          <DashboardCard title="Career Search Tips">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">Keep your resume matching skills list updated on your profile to refine recommendations.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">Toggle saved bookmarks on jobs you like to feed matching keywords into the AI search corpus.</p>
              </li>
            </ul>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
