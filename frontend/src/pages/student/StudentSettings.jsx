import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Key, Mail, User, Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function StudentSettings() {
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
      <div className="max-w-3xl mx-auto py-20 text-center animate-pulse text-gray-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <Helmet>
        <title>Account Settings | Student Dashboard - Smart Job Board</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Configure profile security and basic registration details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar Context */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Security & Privacy</h3>
            <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
              <Shield className="w-4 h-4" /> Credentials
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Account form */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 pb-2 border-b border-gray-50">
              <Info className="w-4.5 h-4.5 text-blue-600" /> Account Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Registration Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-100 text-gray-500 cursor-not-allowed"
                    title="Registration email cannot be changed"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Please contact platform administrators to update your email credentials.</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingProfile ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Password credentials form */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 pb-2 border-b border-gray-50">
              <Key className="w-4.5 h-4.5 text-blue-600" /> Account Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Min. 6 characters"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Key className="w-3.5 h-3.5" />
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
