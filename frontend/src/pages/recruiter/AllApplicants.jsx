import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Award, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { applicationService } from '../../services/applicationService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function AllApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'ats-high', 'ats-low'
  const [expandedAIPanel, setExpandedAIPanel] = useState({}); // { [appId]: boolean }

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await applicationService.getAllRecruiterApplicants();
        setApplicants(response.data || []);
      } catch (error) {
        toast.error('Failed to load applicants: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    const toastId = toast.loading('Updating applicant status...');
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplicants(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      toast.success(`Applicant marked as ${newStatus}`, { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  const toggleAIPanel = (appId) => {
    setExpandedAIPanel(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  // Get unique jobs list for filtering
  const uniqueJobs = Array.from(
    new Map(
      applicants
        .filter(app => app.job)
        .map(app => [app.job._id, app.job])
    ).values()
  );

  // Filter & Sort Applicants
  const filteredApplicants = applicants
    .filter(app => {
      const matchSearch = 
        app.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.extractedSkills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchJob = jobFilter === 'all' || app.job?._id === jobFilter;
      
      return matchSearch && matchStatus && matchJob;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      }
      if (sortBy === 'ats-high') {
        return (b.atsScore || 0) - (a.atsScore || 0);
      }
      if (sortBy === 'ats-low') {
        return (a.atsScore || 0) - (b.atsScore || 0);
      }
      return 0;
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Clock size={11} /> Reviewed
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle size={11} /> Shortlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
            <XCircle size={11} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
            <AlertCircle size={11} /> Pending
          </span>
        );
    }
  };

  const getAtsColorClass = (score) => {
    if (score >= 80) return 'text-green-500 stroke-green-500';
    if (score >= 50) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  const getAtsBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-100 text-green-700';
    if (score >= 50) return 'bg-yellow-50 border-yellow-100 text-yellow-700';
    return 'bg-red-50 border-red-100 text-red-700';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>All Applicants | Recruiter Dashboard - Smart Job Board</title>
      </Helmet>

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-blue-600" />
            All Applicants
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Review, evaluate, and manage candidate submissions across all active jobs.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-sm">
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Total submissions</span>
            <span className="font-bold text-gray-800">{applicants.length}</span>
          </div>
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Filtered count</span>
            <span className="font-bold text-blue-600">{filteredApplicants.length}</span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="applicant-search"
              type="text"
              placeholder="Search by name, email, skills, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-medium placeholder-gray-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Job Filter */}
            <div>
              <select
                id="job-filter"
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
              >
                <option value="all">All Job Postings</option>
                {uniqueJobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
              >
                <option value="newest">Sort by: Date Applied</option>
                <option value="ats-high">Sort by: ATS Match (High)</option>
                <option value="ats-low">Sort by: ATS Match (Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white h-44 rounded-2xl animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
            <Search size={22} />
          </div>
          <h3 className="text-sm font-bold text-gray-700">No applicants found</h3>
          <p className="text-gray-400 max-w-sm mx-auto mt-1 text-xs">
            Try adjusting your search queries, job filters, or status toggles to locate matching candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => {
            const isExpanded = expandedAIPanel[app._id] || false;
            const formattedDate = new Date(app.appliedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div 
                key={app._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100/80 hover:shadow-md hover:border-gray-200/80 transition-all duration-300 overflow-hidden"
              >
                {/* Main Card Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    {/* Left Block: Candidate Identity & Job Context */}
                    <div className="flex gap-4 items-start flex-1">
                      <div className="relative shrink-0">
                        {app.student?.avatar ? (
                          <img 
                            src={app.student.avatar} 
                            alt={app.student.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                            {app.student?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {app.status === 'shortlisted' && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-md shadow-sm">
                            <CheckCircle size={10} className="stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {app.student?.name || 'Unnamed Candidate'}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate font-medium">{app.student?.email}</p>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1.5 text-xs text-gray-400 font-semibold">
                          <span className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-gray-600 flex items-center gap-1">
                            Role: <span className="font-bold text-gray-800">{app.job?.title || 'Unknown Post'}</span>
                          </span>
                          <span className="flex items-center gap-1 py-1 text-gray-400">
                            <Clock size={12} />
                            Applied {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Block: Score & Status Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-stretch lg:items-end justify-between lg:justify-start gap-4 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0 min-w-full sm:min-w-0 sm:w-full lg:w-auto">
                      
                      {/* ATS Score Indicator */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 p-1.5">
                          <svg className="w-9 h-9 transform -rotate-90">
                            <circle
                              cx="18"
                              cy="18"
                              r="15"
                              className="stroke-gray-100"
                              strokeWidth="2.5"
                              fill="transparent"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="15"
                              className={`transition-all duration-1000 ${getAtsColorClass(app.atsScore || 0)}`}
                              strokeWidth="3"
                              strokeDasharray={2 * Math.PI * 15}
                              strokeDashoffset={2 * Math.PI * 15 * (1 - (app.atsScore || 0) / 100)}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-gray-700">
                            {app.atsScore || 0}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ATS Match</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getAtsBgColor(app.atsScore || 0)}`}>
                            {(app.atsScore || 0) >= 80 ? 'Highly Matches' : (app.atsScore || 0) >= 50 ? 'Average Match' : 'Weak Match'}
                          </span>
                        </div>
                      </div>

                      {/* Action Links / Buttons */}
                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <a 
                          id={`resume-view-${app._id}`}
                          href={app.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-xs font-bold text-gray-600 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors w-1/2 sm:w-auto"
                        >
                          <FileText size={14} className="text-gray-400" />
                          Resume
                          <ExternalLink size={10} className="text-gray-400" />
                        </a>

                        <div className="relative w-1/2 sm:w-36">
                          <select 
                            id={`status-select-${app._id}`}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Cover Letter Statement */}
                  {app.coverLetter && (
                    <div className="mt-4 p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 text-xs text-gray-600 leading-relaxed italic">
                      "{app.coverLetter}"
                    </div>
                  )}

                  {/* Skills tags */}
                  {app.extractedSkills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Skills Detected:</span>
                      <div className="flex flex-wrap gap-1">
                        {app.extractedSkills.map(skill => (
                          <span 
                            key={skill} 
                            className="bg-blue-50 border border-blue-100/50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI resume recommendation trigger */}
                  {app.aiSummary && (
                    <div className="mt-4 border-t border-dashed border-gray-100 pt-3 flex justify-between items-center">
                      <button
                        id={`ai-toggle-${app._id}`}
                        onClick={() => toggleAIPanel(app._id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        <Sparkles size={12} className="animate-pulse" />
                        {isExpanded ? 'Hide AI Candidate Insight' : 'View AI Candidate Insight'}
                        {isExpanded ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Collapsible AI Summary Panel */}
                {app.aiSummary && isExpanded && (
                  <div className="bg-gradient-to-r from-blue-50/30 to-indigo-50/10 border-t border-gray-100 p-5 animate-fadeIn">
                    <div className="bg-white rounded-xl border border-blue-100/50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                          <Sparkles size={14} />
                        </div>
                        <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wide">
                          AI Candidate Evaluation summary
                        </h4>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {app.aiSummary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
