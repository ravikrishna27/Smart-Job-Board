import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import About from "../pages/public/About";
import NotFound from "../pages/public/NotFound";

// Dashboard Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import AppliedJobs from "../pages/student/AppliedJobs";
import SavedJobs from "../pages/student/SavedJobs";
import StudentProfile from "../pages/student/StudentProfile";
import StudentSettings from "../pages/student/StudentSettings";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import ManageJobs from "../pages/recruiter/ManageJobs";
import AllApplicants from "../pages/recruiter/AllApplicants";
import RecruiterAnalytics from "../pages/recruiter/RecruiterAnalytics";
import CompanyProfile from "../pages/recruiter/CompanyProfile";
import RecruiterSettings from "../pages/recruiter/RecruiterSettings";
import PostJob from "../pages/recruiter/PostJob";
import EditJob from "../pages/recruiter/EditJob";
import JobApplicants from "../pages/recruiter/JobApplicants";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes with Main Navbar/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.JOBS} element={<Jobs />} />
        <Route path={`${ROUTES.JOBS}/:id`} element={<JobDetails />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="dashboard/applied" element={<AppliedJobs />} />
        <Route path="dashboard/saved" element={<SavedJobs />} />
        <Route path="dashboard/profile" element={<StudentProfile />} />
        <Route path="dashboard/settings" element={<StudentSettings />} />
      </Route>

      <Route 
        path="/recruiter" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="dashboard/jobs" element={<ManageJobs />} />
        <Route path="dashboard/applicants" element={<AllApplicants />} />
        <Route path="dashboard/analytics" element={<RecruiterAnalytics />} />
        <Route path="dashboard/profile" element={<CompanyProfile />} />
        <Route path="dashboard/settings" element={<RecruiterSettings />} />
        <Route path="jobs/new" element={<PostJob />} />
        <Route path="jobs/edit/:id" element={<EditJob />} />
        <Route path="jobs/:id/applicants" element={<JobApplicants />} />
      </Route>
    </Routes>
  );
}
