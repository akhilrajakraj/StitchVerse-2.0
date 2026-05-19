import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      {/* Added dark mode background, border, and a smooth transition effect! */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-purple-600 font-pacifico" style={{fontFamily: 'Pacifico, cursive'}}>
            StitchVerse
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              Gallery
            </Link>
            <Link to="/for-tailors" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              Find Tailors
            </Link>
            <Link to="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              How It Works
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              About
            </Link>
          </nav>

          {/* DESKTOP BUTTONS (Right Side) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* 🌙 THE MAGIC BUTTON! */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <i className="ri-moon-fill text-xl"></i>
              ) : (
                <i className="ri-sun-fill text-xl"></i> 
              )}
            </button>

            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer font-pacifico" style={{fontFamily: 'Pacifico, cursive'}}  >
              Sign In
            </Link>
            <Link to="/register/customer" className="bg-purple-600 text-white px-6 py-2 rounded-lg text-center whitespace-normalize cursor-pointer hover:bg-purple-700 transition-colors font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              Customer Registration
            </Link>
            <Link to="/register/tailor" className="bg-purple-600 text-white px-6 py-2 rounded-lg text-center whitespace-normalize cursor-pointer hover:bg-purple-700 transition-colors font-pacifico" style={{fontFamily: 'Pacifico, cursive'}} >
              Tailor Registration
            </Link>
          </div>

          {/* MOBILE MENU CONTROLS */}
          <div className="md:hidden flex items-center space-x-4">
            
            {/* We added the magic button here too so mobile users can see it! */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <i className="ri-moon-fill text-xl"></i>
              ) : (
                <i className="ri-sun-fill text-xl"></i>
              )}
            </button>

            {/* Hamburger Menu Icon */}
            <button 
              className="p-2 text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-menu-line text-xl"></i>
              </div>
            </button>
          </div>

        </div>

        {/* MOBILE DROP DOWN MENU */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col space-y-3 mt-4">
              <Link to="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                Gallery
              </Link>
              <Link to="/for-tailors" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                Find Tailors
              </Link>
              <Link to="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                How It Works
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                  Sign In
                </Link>
                <Link to="/register" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center whitespace-nowrap cursor-pointer">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}