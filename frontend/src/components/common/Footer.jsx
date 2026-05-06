import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { ROUTES } from '../../routes/routePaths';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Briefcase className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white">
                Smart Job Board
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              Connecting top talent with the best companies. Your journey to a better career starts here.
            </p>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.JOBS} className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Career Advice</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Resume Builder</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Search Resumes</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Smart Job Board. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link to="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link to="#" className="hover:text-white transition-colors">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
