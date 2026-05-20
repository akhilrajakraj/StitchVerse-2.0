import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

export default function TailorHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO - Notice the Blue color for Tailors! */}
          <Link to="/tailor/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400" style={{fontFamily: 'Pacifico, cursive'}}>
            StitchVerse <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-2">for Tailors</span>
          </Link>

          {/* TAILOR SPECIFIC NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/tailor/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/tailor/orders" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Active Orders
            </Link>
            <Link to="/tailor/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              My Portfolio
            </Link>
          </nav>

          {/* CONTROLS */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* The Magic Light Switch */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <i className={`ri-${theme === 'light' ? 'moon' : 'sun'}-fill text-xl`}></i>
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
              <i className="ri-notification-3-line text-xl"></i>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors font-medium cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}