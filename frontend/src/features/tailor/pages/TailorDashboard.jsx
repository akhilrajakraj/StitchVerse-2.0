import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function TailorDashboard() {
    const { user } = useAuth();
    
    // --- STATE MANAGEMENT ---
    const [tailorName, setTailorName] = useState(user?.full_name || 'Master Craftsman');
    const [shopStats, setShopStats] = useState([
        { title: 'New Orders Today', value: '4', icon: 'ri-file-list-3-line', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { title: 'Designs Published', value: '12', icon: 'ri-palette-line', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { title: 'Active Fittings', value: '7', icon: 'ri-calendar-todo-line', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { title: 'Monthly Payout', value: '₹34,800', icon: 'ri-wallet-3-line', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }
    ]);
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- FETCH LIVE TAILOR DATA FROM DJANGO ---
    useEffect(() => {
        const fetchTailorData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Once your tailor app profile views are built in Django, swap out this endpoint!
                const response = await axios.get('http://localhost:8000/api/v1/tailors/profile/me/', config);
                if (response.data) {
                    setTailorName(response.data.business_name || response.data.full_name);
                    setIncomingOrders(response.data.active_orders || []);
                    // Dynamic stats update can be handled here!
                }
            } catch (error) {
                console.error("Error communicating with Tailor database view:", error);
                
                // Elegant mock fallback data for smooth frontend compilation testing!
                setIncomingOrders([
                    { id: 'ST-9021', customer: 'Anjali Menon', item: 'Silk Wedding Lehenga Custom Stitch', status: 'Awaiting Measurements', delivery: 'June 14, 2026', value: '₹18,500' },
                    { id: 'ST-9014', customer: 'Rahul Sharma', item: 'Classic Italian Wool Two-Piece Suit', status: 'Cutting Stage', delivery: 'June 02, 2026', value: '₹12,000' }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTailorData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 font-sans">
            
            {/* --- WORKSPACE WELCOME BANNER --- */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-blue-500/20 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <span className="text-xs font-bold uppercase bg-white/20 text-white px-3 py-1.5 rounded-full tracking-widest">
                        Artisan Workspace
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-2">
                        Welcome to your Studio, {tailorName}! ✂️
                    </h1>
                    <p className="text-blue-100 text-base md:text-lg max-w-2xl">
                        Your custom orders pipeline is active. Review new client measurements or catalog your latest designs to expand your reach.
                    </p>
                </div>
            </div>

            {/* --- QUICK ACTION CONTROLS --- */}
            <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Studio Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to="/tailor/upload" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all">
                        <i className="ri-add-line text-lg"></i> Upload New Design
                    </Link>
                    <Link to="/tailor/portfolio" className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <i className="ri-gallery-line text-lg"></i> Edit Studio Portfolio
                    </Link>
                </div>
            </div>

            {/* --- DASHBOARD STATS METRICS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {shopStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <i className={`${stat.icon} text-2xl`}></i>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ACTIVE STITCH REQUESTS PIPELINE --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Incoming Custom Requests</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Stitch requests assigned to your studio workspace</p>
                    </div>
                    <Link to="/tailor/orders" className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">View Pipeline</Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 font-bold">Order Token & Item</th>
                                <th className="p-4 font-bold">Client Profile</th>
                                <th className="p-4 font-bold">Status Stage</th>
                                <th className="p-4 font-bold">Target Date</th>
                                <th className="p-4 font-bold text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {incomingOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{order.item}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Token ID: {order.id}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">{order.customer}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'Cutting Stage' 
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{order.delivery}</td>
                                    <td className="p-4 text-sm font-black text-gray-900 dark:text-white text-right">{order.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}