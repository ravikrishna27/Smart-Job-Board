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
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

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
        {/* other student routes will go here */}
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
        {/* other recruiter routes will go here */}
      </Route>
    </Routes>
  );
}
