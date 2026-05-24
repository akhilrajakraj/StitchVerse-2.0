import { useNavigate } from 'react-router-dom';
import { useExploreTailors } from '../hooks/useExploreTailors';
import TailorProfileCard from '../../customer/components/TailorProfileCard';

export default function ExploreTailors() {
    const navigate = useNavigate();
    const { tailors, isLoading, error } = useExploreTailors();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-12 text-center max-w-md">
                <i className="ri-error-warning-line text-5xl text-red-500 block mb-3"></i>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Directory Error</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            
            {/* Header section explicitly formatted using your customer-specific branding styles */}
            <div className="mb-10">
                <span className="text-xs font-extrabold text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                    StitchVerse Artisan Directory
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                    Partnered Master Tailors
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xl">
                    Connect with certified fashion craftsmen across Kerala. Load their active portfolio metrics, compare studio specialties, and launch custom apparel bids.
                </p>
            </div>

            {tailors.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-12 rounded-2xl text-center shadow-sm">
                    <i className="ri-user-search-line text-5xl text-gray-400 block mb-3"></i>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Tailors Active</h3>
                    <p className="text-gray-500 text-sm">There are no tailors available in the directory right now.</p>
                </div>
            ) : (
                /* 🎨 Industry-standard fluid responsive responsive display card framework array grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tailors.map((artisan) => (
                        <TailorProfileCard 
                            key={artisan.id}
                            tailor={artisan}
                            onSelect={(id) => navigate(`/customer/tailor/portfolio/${id}`)}
                        />
                    ))}
                </div>
            )}
            
        </div>
    );
}