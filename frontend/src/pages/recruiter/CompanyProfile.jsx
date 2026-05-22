import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase, 
  FileText, 
  Save, 
  Loader2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function CompanyProfile() {
  const [profile, setProfile] = useState({
    companyName: '',
    companyWebsite: '',
    companyIndustry: '',
    companySize: '',
    companyLocation: '',
    companyDescription: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        const data = response.data || {};
        setProfile({
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          companyIndustry: data.companyIndustry || '',
          companySize: data.companySize || '',
          companyLocation: data.companyLocation || '',
          companyDescription: data.companyDescription || ''
        });
      } catch (error) {
        toast.error('Failed to load company details: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.companyName.trim()) {
      toast.error('Company Name is required');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Saving company profile...');
    try {
      await userService.updateProfile(profile);
      toast.success('Company profile updated successfully', { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-pulse text-gray-500 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin text-blue-600">
          <Loader2 size={30} />
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <Helmet>
        <title>Company Profile | Smart Job Board</title>
      </Helmet>

      {/* Banner / Header Card */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent)] pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shrink-0 shadow-sm">
            <Building2 size={28} className="text-white" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.companyName || 'Your Company Name'}
            </h1>
            <p className="text-blue-100 text-xs font-semibold">
              {profile.companyIndustry || 'Industry not set'} • {profile.companyLocation || 'Location not set'}
            </p>
            {profile.companyWebsite && (
              <a 
                href={profile.companyWebsite} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-white/95 hover:text-white mt-1 border-b border-dashed border-white/40 hover:border-white transition-colors"
              >
                Visit Website <ExternalLink size={9} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-1.5">
            <Building2 size={18} className="text-blue-600" />
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="companyName" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={profile.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold"
                />
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label htmlFor="companyWebsite" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  placeholder="https://example.com"
                  value={profile.companyWebsite}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold"
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <label htmlFor="companyIndustry" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Industry
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="companyIndustry"
                  name="companyIndustry"
                  type="text"
                  placeholder="e.g. Technology, Finance, Education"
                  value={profile.companyIndustry}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold"
                />
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-1.5">
              <label htmlFor="companySize" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Company Size
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-none pointer-events-none" />
                <select
                  id="companySize"
                  name="companySize"
                  value={profile.companySize}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600 font-semibold cursor-pointer appearance-none"
                >
                  <option value="">Select company size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="companyLocation" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Headquarters Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="companyLocation"
                  name="companyLocation"
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={profile.companyLocation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="companyDescription" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Company Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows={4}
                  placeholder="Tell candidates about your company's mission, values, culture, and benefits..."
                  value={profile.companyDescription}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold leading-relaxed resize-none"
                ></textarea>
              </div>
            </div>

          </div>
        </div>

        {/* Footer save block */}
        <div className="bg-gray-50/80 px-5 py-4 border-t border-gray-100 flex justify-end">
          <button
            id="company-profile-save-btn"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:scale-100 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={13} />
                Save Company Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
