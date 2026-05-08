import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      
      {/* Mobile Menu Toggle */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Welcome back, {user?.name || 'User'}
        </h2>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown (Simplified for now) */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700 leading-none">{user?.name || 'Guest'}</p>
            <p className="text-gray-500 text-xs mt-1 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>

    </header>
  );
}
