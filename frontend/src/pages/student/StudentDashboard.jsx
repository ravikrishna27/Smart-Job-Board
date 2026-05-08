import { Helmet } from 'react-helmet-async';
import { Briefcase, Bookmark, Star } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useAuth } from '../../hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();

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
          value="12" 
          icon={Briefcase} 
          trend={{ isPositive: true, value: "3" }}
        />
        <StatsCard 
          title="Saved Jobs" 
          value="8" 
          icon={Bookmark} 
        />
        <StatsCard 
          title="Profile Views" 
          value="45" 
          icon={Star} 
          trend={{ isPositive: true, value: "12" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Recent Applications">
            <div className="text-center py-8 text-gray-500">
              <p>You haven't applied to any jobs this week.</p>
              <button className="mt-4 text-blue-600 font-medium hover:text-blue-700">Browse Jobs</button>
            </div>
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
