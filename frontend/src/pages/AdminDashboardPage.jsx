import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboardPage() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // --- UI STATE ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [actionModal, setActionModal] = useState({ isOpen: false, tailorName: '', tailorId: '', action: '' });

    // --- DUMMY DATA (To be replaced by your Django API) ---
    const stats = [
        { title: 'Total Customers', value: '12,450', increase: '+12%', icon: 'ri-user-heart-line', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-500/10' },
        { title: 'Active Tailors', value: '842', increase: '+5%', icon: 'ri-store-2-line', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
        { title: 'Pending Approvals', value: '14', increase: 'Needs Action', icon: 'ri-time-line', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/10' },
        { title: 'Platform Revenue', value: '$45,200', increase: '+24%', icon: 'ri-money-dollar-circle-line', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' }
    ];

    const pendingTailors = [
        { id: 'T-1042', name: 'Elite Threads Boutique', owner: 'Sarah Jenkins', city: 'Ernakulam', applied: '2 hours ago', qualification: 'B.Sc Fashion Design' },
        { id: 'T-1043', name: 'MasterCraft Suits', owner: 'David Chen', city: 'Thiruvananthapuram', applied: '5 hours ago', qualification: '10 Years Experience' },
        { id: 'T-1044', name: 'Vintage Vogue', owner: 'Priya Sharma', city: 'Kozhikode', applied: '1 day ago', qualification: 'Diploma in Fashion' }
    ];

    // --- HANDLERS ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAction = (tailorId, tailorName, action) => {
        setActionModal({ isOpen: true, tailorId, tailorName, action });
    };

    const confirmAction = async () => {
        // Here you will shoot an axios request to Django:
        // axios.post(`/api/v1/accounts/admin/tailors/${actionModal.tailorId}/${actionModal.action}/`)
        console.log(`Successfully ${actionModal.action}ed ${actionModal.tailorName}`);
        setActionModal({ isOpen: false, tailorName: '', tailorId: '', action: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300 font-sans">
            
            {/* --- ACTION MODAL --- */}
            {actionModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center p-8 border border-transparent dark:border-gray-700 transform transition-all scale-105">
                        <div className="mx-auto mb-4 flex justify-center">
                            {actionModal.action === 'approve' 
                                ? <i className="ri-checkbox-circle-fill text-6xl text-emerald-500"></i>
                                : <i className="ri-close-circle-fill text-6xl text-red-500"></i>
                            }
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {actionModal.action === 'approve' ? 'Approve Tailor?' : 'Reject Tailor?'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Are you sure you want to {actionModal.action} <strong>{actionModal.tailorName}</strong>? 
                            {actionModal.action === 'approve' ? ' They will instantly gain access to the platform.' : ' This action cannot be undone.'}
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAction}
                                className={`flex-1 text-white py-3 rounded-xl font-bold transition-colors shadow-lg ${
                                    actionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-100 dark:border-gray-800 w-72 transform transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800">
                        <Link to="/" className="text-3xl font-bold text-indigo-600 dark:text-indigo-400" style={{fontFamily: 'Pacifico, serif'}}>
                            StitchVerse
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-4">
                        <div className="mb-8">
                            <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Command Center</p>
                            <nav className="space-y-2">
                                <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl font-bold transition-colors">
                                    <i className="ri-dashboard-line text-xl mr-3"></i> Overview
                                </Link>
                                <Link to="/admin/tailors" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                                    <i className="ri-scissors-cut-line text-xl mr-3"></i> Manage Tailors
                                    <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">14</span>
                                </Link>
                                <Link to="/admin/customers" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                                    <i className="ri-user-line text-xl mr-3"></i> Manage Customers
                                </Link>
                                <Link to="/admin/orders" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                                    <i className="ri-shopping-bag-3-line text-xl mr-3"></i> Global Orders
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">System</p>
                            <nav className="space-y-2">
                                <Link to="/admin/finances" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                                    <i className="ri-wallet-3-line text-xl mr-3"></i> Finances & Payouts
                                </Link>
                                <Link to="/admin/settings" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
                                    <i className="ri-settings-3-line text-xl mr-3"></i> Platform Settings
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-bold transition-colors">
                            <i className="ri-logout-box-r-line text-xl mr-3"></i> Secure Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : ''}`}>
                
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:hidden"
                        >
                            <i className="ri-menu-line text-2xl"></i>
                        </button>
                        <div className="hidden md:flex items-center ml-4 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl border border-transparent dark:border-gray-700">
                            <i className="ri-search-line text-gray-400 mr-2"></i>
                            <input 
                                type="text" 
                                placeholder="Search users, orders..." 
                                className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <i className={`ri-${theme === 'light' ? 'moon' : 'sun'}-fill text-xl`}></i>
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                            <i className="ri-notification-3-line text-xl"></i>
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-indigo-200 dark:border-indigo-900 shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Control Center</h1>
                        <p className="text-gray-600 dark:text-gray-400">Welcome back. Here is what's happening on StitchVerse today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                        <i className={`${stat.icon} text-2xl`}></i>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.increase === 'Needs Action' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20'}`}>
                                        {stat.increase}
                                    </span>
                                </div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pending Approvals Table (The Bridge to your Django backend) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Tailor Approvals</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and approve new tailor accounts</p>
                            </div>
                            <Link to="/admin/tailors" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold">Business Name</th>
                                        <th className="p-4 font-bold">Location</th>
                                        <th className="p-4 font-bold">Qualification</th>
                                        <th className="p-4 font-bold">Applied</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {pendingTailors.map(tailor => (
                                        <tr key={tailor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{tailor.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{tailor.owner}</div>
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{tailor.city}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {tailor.qualification}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{tailor.applied}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => handleAction(tailor.id, tailor.name, 'approve')}
                                                        className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <i className="ri-check-line text-lg"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(tailor.id, tailor.name, 'reject')}
                                                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <i className="ri-close-line text-lg"></i>
                                                    </button>
                                                    <button 
                                                        className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <i className="ri-eye-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}