import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
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
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path={ROUTES.JOBS} element={<Jobs />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.ABOUT} element={<About />} />

        {/* Protected Dashboard Routes (Placeholders) */}
        <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
        <Route path={ROUTES.RECRUITER_DASHBOARD} element={<RecruiterDashboard />} />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
