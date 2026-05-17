import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboardPage() {
    // 1. Grab the user's data from our Walkie-Talkie
    const { user } = useAuth();
    
    // Fallback name just in case the data is still loading
    const customerName = user?.full_name || 'null'; 

    // --- MOCK DATA (To be replaced by Django later!) ---
    const recentOrders = [
        { id: 'ORD-7829', item: 'Midnight Blue Three-Piece Suit', tailor: 'MasterCraft Suits', status: 'Fitting Scheduled', date: 'Oct 24, 2026', price: '$450' },
        { id: 'ORD-7810', item: 'Silk Evening Gown', tailor: 'Elite Threads', status: 'In Progress', date: 'Oct 18, 2026', price: '$820' },
        { id: 'ORD-7750', item: 'Cotton Summer Shirt', tailor: 'Vintage Vogue', status: 'Delivered', date: 'Sep 30, 2026', price: '$85' }
    ];

    const measurements = {
        updated: 'Oct 15, 2026',
        profile: 'Standard Fit',
        height: '5\'10"',
        chest: '40"',
        waist: '32"',
        hips: '38"'
    };

    // Helper function for beautiful status badges
    const getStatusBadge = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
            case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'Fitting Scheduled': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            
            {/* --- WELCOME BANNER --- */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-lg shadow-purple-500/30 mb-10 relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 right-32 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Welcome back, {customerName}! 👋
                    </h1>
                    <p className="text-purple-100 text-lg md:text-xl max-w-2xl">
                        Your custom wardrobe is looking great. Ready to start your next masterpiece or check on an existing order?
                    </p>
                </div>
            </div>

            {/* --- QUICK ACTIONS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link to="/custom-order" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div className="w-14 h-14 bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="ri-magic-line text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Design New Dress</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Start a fresh custom order from scratch.</p>
                </Link>

                <Link to="/for-tailors" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="ri-search-eye-line text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find a Tailor</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Browse our directory of master craftsmen.</p>
                </Link>

                <Link to="/gallery" className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="ri-image-line text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get Inspired</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Explore the gallery for your next big idea.</p>
                </Link>
            </div>

            {/* --- DASHBOARD SPLIT VIEW --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Recent Orders (Takes up 2 columns) */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Orders</h2>
                            <Link to="/orders" className="text-purple-600 dark:text-purple-400 text-sm font-semibold hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold">Item Details</th>
                                        <th className="p-4 font-bold">Tailor</th>
                                        <th className="p-4 font-bold">Status</th>
                                        <th className="p-4 font-bold text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{order.item}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{order.id} • {order.date}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.tailor}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                                                {order.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Side: Saved Measurements Vault */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden h-full">
                        {/* A soft gradient background for the vault */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">My Sizing Vault</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {measurements.updated}</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                                    <i className="ri-ruler-line text-xl"></i>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 border-dashed">
                                    <span className="text-gray-600 dark:text-gray-400">Fit Profile</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{measurements.profile}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 border-dashed">
                                    <span className="text-gray-600 dark:text-gray-400">Height</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{measurements.height}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 border-dashed">
                                    <span className="text-gray-600 dark:text-gray-400">Chest</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{measurements.chest}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 border-dashed">
                                    <span className="text-gray-600 dark:text-gray-400">Waist</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{measurements.waist}</span>
                                </div>
                            </div>

                            <button className="w-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 py-3 rounded-xl font-bold hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors border border-purple-200 dark:border-purple-500/30">
                                Update Measurements
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}