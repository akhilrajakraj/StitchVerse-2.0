import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // 1. Adaptive background that smoothly transitions with the theme
    <footer className="bg-white dark:bg-gray-950 pt-20 pb-10 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-bold text-pink-600 dark:text-pink-500 mb-6 block" style={{fontFamily: 'Pacifico, serif'}}>
              StitchVerse
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm">
              Connecting talented tailors with customers worldwide. We transform your 
              fashion dreams into perfectly fitted reality through master craftsmanship.
            </p>
            
            {/* 2. Upgraded Social Icons with hover gradients */}
            <div className="flex space-x-4">
              {['facebook-fill', 'twitter-x-fill', 'instagram-fill', 'linkedin-fill'].map((icon, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 dark:hover:from-pink-600 dark:hover:to-purple-700 hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 cursor-pointer shadow-sm"
                >
                  <i className={`ri-${icon} text-lg`}></i>
                </div>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">For Customers</h4>
            <ul className="space-y-4">
              {['Browse Gallery', 'Find Tailors', 'Place Order', 'Book Appointment'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item === 'Browse Gallery' ? '/gallery' : '#'} 
                    className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-300 inline-flex items-center group cursor-pointer"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">For Tailors</h4>
            <ul className="space-y-4">
              {['Join Platform', 'Tailor Dashboard', 'Resources', 'Seller Support'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item === 'Join Platform' ? '/for-tailors' : '#'} 
                    className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-300 inline-flex items-center group cursor-pointer"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to="#" 
                    className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-300 inline-flex items-center group cursor-pointer"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. The Newsletter Box */}
        <div className="border-t border-b border-gray-100 dark:border-gray-800 py-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Subscribe to our Newsletter</h4>
              <p className="text-gray-600 dark:text-gray-400">Get the latest fashion trends and exclusive offers.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full sm:w-72 px-6 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
              />
              <button className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/30 whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4 md:mb-0">
            © 2026 StitchVerse. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-500 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors cursor-pointer">
              Help Center
            </Link>
            <Link to="#" className="text-gray-500 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors cursor-pointer">
              Security
            </Link>
            <Link to="#" className="text-gray-500 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm transition-colors cursor-pointer">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}