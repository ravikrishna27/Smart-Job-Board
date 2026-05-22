import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Calendar, CheckCircle2, AlertCircle, FileText, Search, ChevronDown, ChevronUp, MapPin, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { applicationService } from '../../services/applicationService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getMyApplications();
        setApplications(response.data || []);
      } catch (error) {
        toast.error('Failed to load applications: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewed':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-100',
          text: 'Reviewed',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'shortlisted':
        return {
          bg: 'bg-green-50 text-green-700 border-green-100',
          text: 'Shortlisted',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'rejected':
        return {
          bg: 'bg-red-50 text-red-700 border-red-100',
          text: 'Not Selected',
          icon: <AlertCircle className="w-3.5 h-3.5" />
        };
      default:
        return {
          bg: 'bg-yellow-50 text-yellow-700 border-yellow-100',
          text: 'Pending',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id) => {
    if (expandedApp === id) {
      setExpandedApp(null);
    } else {
      setExpandedApp(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Applied Jobs | Student Dashboard - Smart Job Board</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applied Jobs</h1>
        <p className="text-gray-500 mt-1">Track and manage all your active job applications.</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-1">
          {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'rejected' ? 'Not Selected' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <DashboardCard>
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5] mb-3" />
            <p className="font-medium text-gray-700">No applications found</p>
            <p className="text-sm text-gray-400 mt-1">Try refining your search or browse open listings.</p>
          </div>
        </DashboardCard>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const badge = getStatusBadge(app.status);
            const isExpanded = expandedApp === app._id;
            
            return (
              <div 
                key={app._id} 
                className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${
                  isExpanded ? 'border-blue-200' : 'border-gray-100'
                }`}
              >
                {/* Header card summary */}
                <div 
                  onClick={() => toggleExpand(app._id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold border border-blue-100">
                      {app.job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">{app.job.title}</h3>
                      <p className="text-sm text-gray-600 font-medium mt-0.5">{app.job.company}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.job.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${badge.bg}`}>
                      {badge.icon}
                      {badge.text}
                    </span>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded content / Timeline details */}
                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-gray-100 bg-gray-50/20 pt-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Metadata info */}
                      <div className="lg:col-span-1 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Assets</h4>
                        
                        {/* Resume Info */}
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <FileText className="text-blue-600 w-5 h-5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-800 truncate" title={app.resumeFileName || 'Resume.pdf'}>
                              {app.resumeFileName || 'Resume.pdf'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">PDF Resume</p>
                          </div>
                          <a 
                            href={app.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap ml-2"
                          >
                            View File
                          </a>
                        </div>

                        {/* Cover Letter if exists */}
                        {app.coverLetter && (
                          <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm space-y-1.5">
                            <h5 className="text-xs font-bold text-gray-700">Cover Letter Notes:</h5>
                            <p className="text-xs text-gray-600 leading-relaxed italic">
                              "{app.coverLetter}"
                            </p>
                          </div>
                        )}

                        {/* ATS Score if matches */}
                        {app.atsScore > 0 && (
                          <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">ATS Profile Match</span>
                            <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                                app.atsScore >= 80 ? 'bg-green-50 text-green-700' :
                                app.atsScore >= 50 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {app.atsScore}%
                              </span>
                              <span className="text-xs text-gray-500">AI-evaluated skill match rating.</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Application Progress Timeline */}
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Timeline</h4>
                        
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                          
                          {/* Step 1: Applied */}
                          <div className="relative">
                            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full border bg-green-500 border-green-500 flex items-center justify-center text-white text-[10px]">✓</span>
                            <div className="pl-2">
                              <p className="text-sm font-semibold text-gray-800">Job Application Submitted</p>
                              <p className="text-xs text-gray-400 mt-0.5">{new Date(app.appliedAt).toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-1">Your resume and application details were successfully forwarded to the recruiter.</p>
                            </div>
                          </div>

                          {/* Step 2: Reviewed */}
                          <div className="relative">
                            <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-white text-[10px] ${
                              ['reviewed', 'shortlisted', 'rejected'].includes(app.status)
                                ? 'bg-green-500 border-green-500'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {['reviewed', 'shortlisted', 'rejected'].includes(app.status) ? '✓' : '2'}
                            </span>
                            <div className="pl-2">
                              <p className="text-sm font-semibold text-gray-800">Application Under Review</p>
                              {app.reviewedAt && (
                                <p className="text-xs text-gray-400 mt-0.5">{new Date(app.reviewedAt).toLocaleString()}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">The hiring manager is reviewing your background and evaluating skills compatibility.</p>
                            </div>
                          </div>

                          {/* Step 3: Decision */}
                          <div className="relative">
                            <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-white text-[10px] ${
                              app.status === 'shortlisted' ? 'bg-green-500 border-green-500' :
                              app.status === 'rejected' ? 'bg-red-50 border-red-500 text-red-500' :
                              'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {app.status === 'shortlisted' ? '✓' : app.status === 'rejected' ? '✗' : '3'}
                            </span>
                            <div className="pl-2">
                              <p className="text-sm font-semibold text-gray-800">
                                {app.status === 'shortlisted' ? 'Congratulations! Shortlisted' : 
                                 app.status === 'rejected' ? 'Application Decision' : 'Hiring Decision'}
                              </p>
                              {(app.shortlistedAt || app.rejectedAt) && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {new Date(app.shortlistedAt || app.rejectedAt).toLocaleString()}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {app.status === 'shortlisted' ? 'Your profile stood out! The recruiter will contact you shortly for interview scheduling.' :
                                 app.status === 'rejected' ? 'Thank you for your interest. Unfortunately, the company decided to move forward with other candidates at this time.' :
                                 'Your application status will be updated once the screening process concludes.'}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
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
