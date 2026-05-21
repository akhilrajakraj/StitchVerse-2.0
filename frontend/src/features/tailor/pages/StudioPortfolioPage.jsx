import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tailorApi } from '../services/tailorApi';
import DesignCard from '../../designs/components/DesignCard';

export default function StudioPortfolioPage() {
    // We start with isLoading as true, so the spinner shows instantly
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🌟 FIX 1: Define and call the fetch function strictly INSIDE the useEffect.
    // This perfectly synchronizes React's render cycle and stops the cascading warning!
    useEffect(() => {
        const fetchMyDesigns = async () => {
            try {
                const response = await tailorApi.getMyDesigns();
                if (response.success) {
                    setDesigns(response.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch portfolio:", err);
                setError("Could not load your designs. Please try again.");
            } finally {
                // Safely turns off the spinner asynchronously
                setIsLoading(false);
            }
        };

        fetchMyDesigns();
    }, []); // Empty array means this absolutely only runs once on mount.

    const handleDelete = async (designId) => {
        if (!window.confirm("Are you sure you want to permanently delete this design?")) return;
        
        try {
            const response = await tailorApi.deleteDesign(designId);
            if (response.success) {
                // Instantly remove the card from the UI grid
                setDesigns(prev => prev.filter(d => d.id !== designId));
            }
        } catch (err) {
            // 🌟 FIX 2: We now USE the 'err' variable by logging it, satisfying ESLint!
            console.error("Delete operation failed:", err);
            alert("Failed to delete design. It may be locked to active orders.");
        }
    };

    const handleEdit = (design) => {
        console.log("Edit clicked for:", design.name);
        alert("Edit feature coming soon! You clicked: " + design.name);
    };

    const handleView = (design) => {
        console.log("View clicked for:", design.name);
    };

    // If loading, show the spinner and nothing else
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 font-sans">
            
            {/* Gradient Header Container */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    
                    <div className="flex items-center relative z-10 w-full md:w-auto">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-5 shrink-0 backdrop-blur-sm border border-white/10">
                            <i className="ri-gallery-line text-3xl text-white"></i>
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Studio Portfolio</h1>
                            <p className="text-blue-100 mt-1 text-sm md:text-base">Manage your active catalog and showcase your craft.</p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 w-full md:w-auto flex items-center justify-between md:justify-end gap-6 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="text-white text-center">
                            <span className="block text-2xl font-black">{designs.length}</span>
                            <span className="text-xs text-blue-100 uppercase tracking-wider font-bold">Total Designs</span>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <Link to="/tailor/upload" className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg">
                            <i className="ri-add-line"></i> New Upload
                        </Link>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 font-bold">{error}</div>
            )}

            {/* Empty State vs Grid Canvas */}
            {designs.length === 0 && !error ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="w-24 h-24 mx-auto mb-5 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center">
                        <i className="ri-image-add-line text-gray-400 text-4xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No designs cataloged yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Your studio gallery is currently empty. Start uploading!</p>
                    <Link to="/tailor/upload" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        Upload First Design
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {designs.map((design) => (
                        <DesignCard 
                            key={design.id} 
                            design={design} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}