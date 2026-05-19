import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    // --- UI STATE (Only page-specific states live here now!) ---
    const [actionModal, setActionModal] = useState({ isOpen: false, tailorName: '', tailorId: '', action: '' });

    // --- DUMMY DATA (To be replaced by your Django API endpoints later) ---
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
        <>
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

            {/* --- DASHBOARD SUB-PAGE CANVAS CONTENT --- */}
            {/* This code gets cleanly injected straight into the <Outlet /> layout node! */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Control Center</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome back. Here is what's happening on StitchVerse today.</p>
            </div>

            {/* Stats Metrics Grid Layout */}
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

            {/* Pending Approvals Data Management Engine Table */}
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
        </>
    );
}