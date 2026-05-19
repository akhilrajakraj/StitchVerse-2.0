import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AdminSidebar from '../../features/admin/components/AdminSidebar';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300 font-sans">
            {/* Modular Sidebar Component */}
            <AdminSidebar isSidebarOpen={isSidebarOpen} />

            {/* Dynamic Panel Canvas */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : ''}`}>
                <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:hidden">
                        <i className="ri-menu-line text-2xl"></i>
                    </button>
                    
                    <div className="flex items-center space-x-4 ml-auto">
                        <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <i className={`ri-${theme === 'light' ? 'moon' : 'sun'}-fill text-xl`}></i>
                        </button>
                        <button onClick={() => { logout(); navigate('/login'); }} className="text-sm font-bold text-red-600 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl hover:bg-red-100">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {/* Magical routing injection node */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}