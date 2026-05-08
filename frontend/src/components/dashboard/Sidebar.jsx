import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { studentLinks, recruiterLinks } from '../../data/dashboardLinks';

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();
  
  // Select the appropriate links based on user role
  const links = role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand/Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600">Smart Job Board</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  // Close sidebar on mobile after clicking a link
                  if (window.innerWidth < 1024) onClose();
                }}
                end={link.path === '/student/dashboard' || link.path === '/recruiter/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {link.title}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
