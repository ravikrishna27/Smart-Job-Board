import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, BookOpen, AlertTriangle, RefreshCw, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { recommendationService } from '../../services/recommendationService';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await recommendationService.getStudentGap();
      setData(response.data || {});
    } catch (error) {
      toast.error('Failed to load skill analysis: ' + getErrorMessage(error));
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
    toast.loading('Analyzing skill gap profile...', { id: 'refresh-gap' });
    fetchAnalytics().then(() => {
      toast.success('Skill gap profile refreshed successfully', { id: 'refresh-gap' });
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-pulse text-gray-500 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin text-blue-600">
          <RefreshCw size={30} />
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Parsing ATS profile and mapping skill gaps...</p>
      </div>
    );
  }

  const { alignmentRate = 0, matchedSkills = [], missingSkills = [], suggestions = [] } = data || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <Helmet>
        <title>AI Skill Gap & ATS Insights | Student Dashboard</title>
      </Helmet>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-blue-600" />
            AI Career Insights & ATS Gap Analysis
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Intelligent analysis of your skillset against all jobs you've applied to and saved.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-75 disabled:scale-100 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Re-analyzing...' : 'Refresh AI suggestions'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Alignment Gauge Card */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-4 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">ATS Skill Match Rate</span>
          
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-gray-50"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-blue-600 transition-all duration-1000"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - alignmentRate / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-gray-900 block">{alignmentRate}%</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Job Fit</span>
            </div>
          </div>

          <div className="text-center">
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full inline-block border ${
              alignmentRate >= 80 ? 'bg-green-50 border-green-100 text-green-700' : alignmentRate >= 50 ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              {alignmentRate >= 80 ? 'Highly Matches Industry' : alignmentRate >= 50 ? 'Moderate Match Pool' : 'Needs Development'}
            </span>
          </div>
        </div>

        {/* Actionable Suggestions Card */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider text-xs text-gray-400 border-b border-gray-50 pb-2">
            <BookOpen size={16} className="text-blue-600" />
            AI Upskilling Action Plan
          </h3>
          
          <div className="space-y-4">
            {suggestions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
                <div className="w-5 h-5 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center text-[10px] font-bold text-blue-600 mt-0.5 shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Matched vs Missing Skills Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-green-700 flex items-center gap-1.5 border-b border-green-50 pb-3">
            <CheckCircle size={18} className="text-green-600" />
            Matched Strengths ({matchedSkills.length})
          </h3>

          {matchedSkills.length === 0 ? (
            <p className="text-gray-400 text-xs py-4 text-center font-medium">
              No overlapping technical matches identified yet. Update your profile skills!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map(skill => (
                <span
                  key={skill}
                  className="bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-102 transition-all"
                >
                  <CheckCircle size={11} className="stroke-[3]" />
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-amber-700 flex items-center gap-1.5 border-b border-amber-50 pb-3">
            <AlertTriangle size={18} className="text-amber-600" />
            Identified Skill Gaps ({missingSkills.length})
          </h3>

          {missingSkills.length === 0 ? (
            <p className="text-green-600 text-xs py-4 text-center font-medium bg-green-50/50 rounded-xl border border-green-100">
              Incredible! You have met all requirements across your target postings.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(skill => (
                <span
                  key={skill}
                  className="bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-102 transition-all hover:bg-amber-100/50"
                  title="Click to learn about this skill"
                >
                  <ArrowRight size={11} />
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Skill Development Resources Block */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent)] pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BookOpen size={20} />
            Free Career Upskilling Tips
          </h3>
          <p className="text-blue-100 text-xs max-w-2xl leading-relaxed">
            Ready to tackle your skill gaps? We recommend exploring open-source repositories on GitHub, building mini prototypes using missing technologies, and adding those specific project URLs to your Student Profile. This boosts candidate search visibility for recruiters.
          </p>
        </div>
      </div>
    </div>
  );
}
