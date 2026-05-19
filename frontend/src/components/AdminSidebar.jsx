import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar({ isSidebarOpen }) {
    const location = useLocation();

    const navLinks = [
        { path: '/admin/dashboard', label: 'Overview', icon: 'ri-dashboard-line' },
        { path: '/admin/tailors', label: 'Manage Tailors', icon: 'ri-scissors-cut-line', count: 14 },
        { path: '/admin/customers', label: 'Manage Customers', icon: 'ri-user-line' },
        { path: '/admin/orders', label: 'Global Orders', icon: 'ri-shopping-bag-3-line' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-100 dark:border-gray-800 w-72 transform transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="h-full flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/" className="text-3xl font-bold text-indigo-600 dark:text-indigo-400" style={{ fontFamily: 'Pacifico, serif' }}>
                        StitchVerse
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Command Center</p>
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${
                                        isActive 
                                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <i className={`${link.icon} text-xl mr-3`}></i> {link.label}
                                    {link.count && (
                                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">{link.count}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}