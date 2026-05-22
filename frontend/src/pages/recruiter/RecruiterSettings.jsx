import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Key, Mail, User, Info, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function RecruiterSettings() {
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      } catch (error) {
        toast.error('Failed to load settings: ' + getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      toast.warning('Name and Email are required');
      return;
    }
    
    setIsSavingProfile(true);
    const toastId = toast.loading('Saving account details...');
    try {
      await userService.updateProfile({ name: profile.name });
      toast.success('Account details updated successfully!', { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    const toastId = toast.loading('Updating security credentials...');
    try {
      await api.put('/users/update-password', { currentPassword, newPassword });
      toast.success('Password updated successfully!', { id: toastId });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-pulse text-gray-500 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin text-blue-600">
          <Loader2 size={30} />
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <Helmet>
        <title>Recruiter Settings | Smart Job Board</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Configure profile security and platform registration details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-1">
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Security & Privacy</h3>
            <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
              <Shield className="w-4 h-4" /> Credentials
            </div>
          </div>
        </div>

        {/* Action Panel Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Account Profile Details */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 pb-2 border-b border-gray-50 uppercase tracking-wider text-xs text-gray-400">
              <Info className="w-4.5 h-4.5 text-blue-600" /> Account Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Registration Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-100 text-gray-500 cursor-not-allowed font-semibold"
                    title="Registration email cannot be changed"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Please contact platform administrators to update your email credentials.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  id="profile-save-btn"
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-75 disabled:scale-100 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 pb-2 border-b border-gray-50 uppercase tracking-wider text-xs text-gray-400">
              <Key className="w-4.5 h-4.5 text-blue-600" /> Account Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="currentPassword" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Min. 6 characters"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  id="password-save-btn"
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-75 disabled:scale-100 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key size={13} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
