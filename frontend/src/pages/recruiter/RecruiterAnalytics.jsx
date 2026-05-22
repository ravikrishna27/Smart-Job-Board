import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function RecruiterAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await userService.getAnalytics();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics: ' + getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center animate-pulse text-gray-500 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin text-blue-600">
          <RefreshCw size={30} />
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Assembling analytics dashboard...</p>
      </div>
    );
  }

  const { stats = {}, funnel = {}, topJobs = [] } = data || {};

  // Compute rates
  const shortlistedRate = stats.totalApplications > 0 
    ? Math.round((stats.shortlistedCount / stats.totalApplications) * 100) 
    : 0;

  const funnelMax = Math.max(funnel.pending || 1, funnel.reviewed || 1, funnel.shortlisted || 1, funnel.rejected || 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>Recruiter Analytics | Smart Job Board</title>
      </Helmet>

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Recruiting Insights
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor hiring metrics, candidate funnel conversions, and posting engagement levels.</p>
        </div>
        <div>
          <button
            id="analytics-refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 active:scale-95 text-gray-600 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Job Listings */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Job Postings</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{stats.totalJobs || 0}</h3>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 rounded-lg px-2 py-0.5 mt-1.5 inline-block">
                {stats.activeJobs || 0} Active
              </span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Briefcase size={20} />
          </div>
        </div>

        {/* Card 2: Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Applications</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{stats.totalApplications || 0}</h3>
              <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Across all positions</span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Users size={20} />
          </div>
        </div>

        {/* Card 3: Avg ATS Rating */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Avg ATS Fit</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{stats.avgAtsScore || 0}%</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border mt-1.5 inline-block ${
                (stats.avgAtsScore || 0) >= 70 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'
              }`}>
                {(stats.avgAtsScore || 0) >= 70 ? 'Strong Match Pool' : 'Moderate Match Pool'}
              </span>
            </div>
          </div>
          <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={20} className="animate-pulse" />
          </div>
        </div>

        {/* Card 4: Shortlist Rate */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Shortlist Rate</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{shortlistedRate}%</h3>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 mt-1.5 inline-block">
                {stats.shortlistedCount || 0} Shortlisted
              </span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <UserCheck size={20} />
          </div>
        </div>

      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruiter Pipeline Funnel */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp size={18} className="text-blue-600" />
              Recruitment Funnel Conversion
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Visualizing applicant count and status transitions.</p>
          </div>

          <div className="space-y-5">
            {/* Funnel: Pending */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                  Applied (Pending)
                </span>
                <span className="font-bold text-gray-900">{funnel.pending || 0} <span className="text-gray-400 font-medium">({Math.round(((funnel.pending || 0) / (stats.totalApplications || 1)) * 100)}%)</span></span>
              </div>
              <div className="w-full bg-gray-50 h-5 rounded-lg overflow-hidden border border-gray-100">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-lg transition-all duration-1000"
                  style={{ width: `${Math.max(4, Math.round(((funnel.pending || 0) / funnelMax) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Funnel: Reviewed */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  Reviewed
                </span>
                <span className="font-bold text-gray-900">{funnel.reviewed || 0} <span className="text-gray-400 font-medium">({Math.round(((funnel.reviewed || 0) / (stats.totalApplications || 1)) * 100)}%)</span></span>
              </div>
              <div className="w-full bg-gray-50 h-5 rounded-lg overflow-hidden border border-gray-100">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-lg transition-all duration-1000"
                  style={{ width: `${Math.max(4, Math.round(((funnel.reviewed || 0) / funnelMax) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Funnel: Shortlisted */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  Shortlisted
                </span>
                <span className="font-bold text-gray-900">{funnel.shortlisted || 0} <span className="text-gray-400 font-medium">({Math.round(((funnel.shortlisted || 0) / (stats.totalApplications || 1)) * 100)}%)</span></span>
              </div>
              <div className="w-full bg-gray-50 h-5 rounded-lg overflow-hidden border border-gray-100">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-lg transition-all duration-1000"
                  style={{ width: `${Math.max(4, Math.round(((funnel.shortlisted || 0) / funnelMax) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Funnel: Rejected */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  Rejected
                </span>
                <span className="font-bold text-gray-900">{funnel.rejected || 0} <span className="text-gray-400 font-medium">({Math.round(((funnel.rejected || 0) / (stats.totalApplications || 1)) * 100)}%)</span></span>
              </div>
              <div className="w-full bg-gray-50 h-5 rounded-lg overflow-hidden border border-gray-100">
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-lg transition-all duration-1000"
                  style={{ width: `${Math.max(4, Math.round(((funnel.rejected || 0) / funnelMax) * 100))}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* ATS Fit distribution gauge */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-between space-y-5">
          <div className="self-start">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles size={18} className="text-yellow-500 animate-pulse" />
              ATS Pool Distribution
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Overall rating correlation indicator.</p>
          </div>

          {/* Radial meter */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-gray-50"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-blue-600 transition-all duration-1000"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - (stats.avgAtsScore || 0) / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-gray-900 block">{stats.avgAtsScore || 0}%</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Global Fit</span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-center w-full text-xs text-gray-500 leading-relaxed">
            Registered candidates showcase a solid <span className="font-semibold text-blue-600">{stats.avgAtsScore || 0}% ATS match score</span> against your requirements.
          </div>
        </div>

      </div>

      {/* Top Postings List */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <FolderOpen size={18} className="text-blue-600" />
            Top Active Job Posts
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Hiring postings ranked by candidates volume.</p>
        </div>

        {topJobs.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs font-semibold">
            No active jobs found with candidate submissions.
          </div>
        ) : (
          <div className="space-y-3">
            {topJobs.map((job, idx) => {
              const maxApplicants = Math.max(...topJobs.map(j => j.applicantCount || 1));
              const pct = Math.max(10, Math.round(((job.applicantCount || 0) / maxApplicants) * 100));

              return (
                <div 
                  key={job._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all gap-4"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center text-[10px] font-bold text-blue-600">
                        #{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 truncate">{job.title}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${
                        job.status === 'open' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-400 font-semibold pl-7">
                      <span>{job.company || 'Direct Recruiter'}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 w-full sm:w-56 shrink-0">
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 shrink-0 w-20 text-right">
                      {job.applicantCount || 0} applicants
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
