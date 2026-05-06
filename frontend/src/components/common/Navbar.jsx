import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Briefcase } from 'lucide-react'
import { ROUTES } from '../../routes/routePaths'

/**
 * NAVBAR COMPONENT
 * 
 * Professional responsive navigation bar for Smart Job Board
 * Features:
 * - Mobile-friendly hamburger menu
 * - Professional branding
 * - Call-to-action buttons
 * - Responsive design that works on all screen sizes
 * - Active route highlighting
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinkClasses = ({ isActive }) =>
    `text-gray-700 hover:text-blue-600 transition-colors font-medium ${
      isActive ? 'text-blue-600' : ''
    }`

  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-lg transition-colors font-medium ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
    }`

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO & BRANDING */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0" onClick={closeMenu}>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Briefcase className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              Smart Job Board
            </span>
            <span className="text-xl font-bold text-gray-900 sm:hidden">
              SJB
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to={ROUTES.JOBS} className={navLinkClasses}>
              Jobs
            </NavLink>
            <NavLink to={ROUTES.ABOUT} className={navLinkClasses}>
              About
            </NavLink>
          </div>

          {/* CTA BUTTONS - DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to={ROUTES.LOGIN}
              className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link 
              to={ROUTES.REGISTER}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink 
              to={ROUTES.JOBS}
              onClick={closeMenu}
              className={mobileNavLinkClasses}
            >
              Jobs
            </NavLink>
            <NavLink 
              to={ROUTES.ABOUT}
              onClick={closeMenu}
              className={mobileNavLinkClasses}
            >
              About
            </NavLink>
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
              <Link 
                to={ROUTES.LOGIN}
                onClick={closeMenu}
                className="block w-full text-center px-3 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link 
                to={ROUTES.REGISTER}
                onClick={closeMenu}
                className="block w-full text-center px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
