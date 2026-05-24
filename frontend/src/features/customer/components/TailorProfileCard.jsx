export default function TailorProfileCard({ tailor, onSelect }) {
    // 1. Establish robust fallbacks to safeguard against missing DB fields
    const name = tailor?.full_name || 'Master Craftsman';
    const specialty = tailor?.specialisation || 'Custom Stitching';
    const biography = tailor?.bio || 'No studio biography provided yet.';
    const rating = tailor?.average_rating || '0.00';
    const completedOrders = tailor?.total_orders || 0;
    
    // Fallback defaults for address objects nested in backend responses
    const city = tailor?.address?.city || 'Kerala';
    const district = tailor?.address?.district || 'India';

    // 2. Derive dynamic initials for avatar placeholders cleanly
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
            
            <div>
                {/* --- RATING BADGE --- */}
                <div className="absolute top-4 right-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                    <i className="ri-star-fill"></i> {rating}
                </div>

                {/* --- HEADER: AVATAR & INFO IDENTITY --- */}
                <div className="flex items-center gap-4 mb-5">
                    {/* Circle monogram placeholder frame using StitchVerse tailor blue accent grids */}
                    <div className="w-14 h-14 min-w-[56px] bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg tracking-wider transition-transform duration-300 group-hover:scale-105">
                        {initials}
                    </div>
                    
                    <div className="pr-12">
                        <h3 className="text-md font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                            <i className="ri-map-pin-line text-blue-500"></i> {city}, {district}
                        </p>
                    </div>
                </div>

                {/* --- SPECIALTY & METRICS --- */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2.5 py-1 rounded-md">
                        🧵 {specialty}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-2.5 py-1 rounded-md">
                        📦 {completedOrders} Orders Completed
                    </span>
                </div>

                {/* --- BIO SUMMARY --- */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6">
                    {biography}
                </p>
            </div>

            {/* --- ACTION BUTTON --- */}
            <button
                type="button"
                onClick={() => onSelect(tailor.id)}
                className="w-full bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer group-hover:-translate-y-0.5 shadow-sm"
            >
                <i className="ri-store-2-line"></i> Visit Studio Workshop
            </button>

        </div>
    );
}