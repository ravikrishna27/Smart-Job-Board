import { 
  Home, 
  Briefcase, 
  Bookmark, 
  User, 
  Settings, 
  FileText, 
  Users, 
  BarChart,
  Building,
  Award
} from 'lucide-react';
import { ROUTES } from '../routes/routePaths';

export const studentLinks = [
  {
    title: "Dashboard",
    icon: Home,
    path: ROUTES.STUDENT_DASHBOARD
  },
  {
    title: "Applied Jobs",
    icon: Briefcase,
    path: `${ROUTES.STUDENT_DASHBOARD}/applied`
  },
  {
    title: "Saved Jobs",
    icon: Bookmark,
    path: `${ROUTES.STUDENT_DASHBOARD}/saved`
  },
  {
    title: "My Profile",
    icon: User,
    path: `${ROUTES.STUDENT_DASHBOARD}/profile`
  },
  {
    title: "AI ATS Insights",
    icon: Award,
    path: `${ROUTES.STUDENT_DASHBOARD}/analytics`
  },
  {
    title: "Settings",
    icon: Settings,
    path: `${ROUTES.STUDENT_DASHBOARD}/settings`
  }
];

export const recruiterLinks = [
  {
    title: "Dashboard",
    icon: Home,
    path: ROUTES.RECRUITER_DASHBOARD
  },
  {
    title: "Manage Jobs",
    icon: FileText,
    path: `${ROUTES.RECRUITER_DASHBOARD}/jobs`
  },
  {
    title: "Applicants",
    icon: Users,
    path: `${ROUTES.RECRUITER_DASHBOARD}/applicants`
  },
  {
    title: "Analytics",
    icon: BarChart,
    path: `${ROUTES.RECRUITER_DASHBOARD}/analytics`
  },
  {
    title: "Company Profile",
    icon: Building, // need to import Building
    path: `${ROUTES.RECRUITER_DASHBOARD}/profile`
  },
  {
    title: "Settings",
    icon: Settings,
    path: `${ROUTES.RECRUITER_DASHBOARD}/settings`
  }
];
