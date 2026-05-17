import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Download, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import DashboardCard from '../../components/dashboard/DashboardCard';

export default function JobApplicants() {
  const { id: jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          applicationService.getJobApplicants(jobId),
          jobService.getJobById(jobId)
        ]);
        setApplicants(appRes.data);
        setJob(jobRes.data);
      } catch (error) {
        toast.error('Failed to load applicants: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplicants(applicants.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      toast.success(`Applicant marked as ${newStatus}`, { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading applicants...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Applicants - {job?.title} | Smart Job Board</title>
      </Helmet>

      <div className="container-custom max-w-6xl">
        <div className="mb-6">
          <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Applicants for {job?.title}</h1>
          <p className="text-gray-600 mt-2">Manage the candidates who applied for this role.</p>
        </div>

        <DashboardCard>
          {applicants.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No one has applied to this job yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applicants.map((app) => (
                <div key={app._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    {/* Student Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {app.student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.student.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{app.student.email}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <Clock size={14} />
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border border-gray-100 mb-4">
                          "{app.coverLetter}"
                        </div>
                        
                        {/* AI Parsed Data */}
                        {(app.atsScore > 0 || app.extractedSkills?.length > 0) && (
                          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">AI Match</span>
                                ATS Score
                              </h4>
                              <div className={`text-lg font-bold ${app.atsScore >= 80 ? 'text-green-600' : app.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {app.atsScore}%
                              </div>
                            </div>
                            
                            {app.extractedSkills?.length > 0 && (
                              <div>
                                <p className="text-xs text-blue-800 font-medium mb-2">Detected Skills:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {app.extractedSkills.map(skill => (
                                    <span key={skill} className="bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {app.aiSummary && (
                              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-blue-100/50">
                                {app.aiSummary}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div className="flex flex-col items-end gap-4 min-w-[200px]">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>

                      <div className="flex gap-2">
                        <a 
                          href={app.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={16} /> View Resume
                        </a>
                      </div>

                      <div className="w-full mt-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1 text-right">Update Status</label>
                        <select 
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
