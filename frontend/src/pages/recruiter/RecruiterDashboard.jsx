import { Helmet } from 'react-helmet-async';
import { FileText, Users, Eye } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export default function RecruiterDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Dashboard | Recruiter - Smart Job Board</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Overview of your hiring pipeline.</p>
        </div>
        <Button variant="primary">Post a New Job</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Jobs" 
          value="4" 
          icon={FileText} 
        />
        <StatsCard 
          title="Total Applicants" 
          value="142" 
          icon={Users} 
          trend={{ isPositive: true, value: "24" }}
        />
        <StatsCard 
          title="Profile Views" 
          value="890" 
          icon={Eye} 
          trend={{ isPositive: true, value: "15%" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Recent Applicants">
            <div className="text-center py-8 text-gray-500">
              <p>No new applicants to review today.</p>
            </div>
          </DashboardCard>
        </div>
        
        <div className="space-y-6">
          <DashboardCard title="Hiring Tips">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Write clearer job descriptions to attract better candidates.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Respond to applicants within 48 hours to maintain a strong employer brand.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Use skills assessments to filter candidates effectively.</p>
              </li>
            </ul>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
