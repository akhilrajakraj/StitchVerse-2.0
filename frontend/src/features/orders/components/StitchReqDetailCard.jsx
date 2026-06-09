export default function StitchReqDetailCard({ data }) {
    if (!data) return null;

    // Safely unpack the JSON measurements and style preferences
    let parsedDetails = {};
    try {
        parsedDetails = typeof data.design_details === 'string' 
            ? JSON.parse(data.design_details) 
            : data.design_details || {};
    } catch (e) {
        console.error("Could not parse design details:", e);
    }

    const measurements = parsedDetails.measurements || {};
    const stylePrefs = parsedDetails.style_preferences || {};

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{data.name}</h2>
                    <p className="text-gray-500 font-medium">
                        <span className="text-purple-600 dark:text-purple-400">{data.garment_type?.name}</span> • {data.fabric}
                    </p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-700 uppercase tracking-wide">
                    {data.status.replace('_', ' ')}
                </span>
            </div>

            {/* Core Visual Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Color</p>
                    <p className="font-bold text-gray-900 dark:text-white">{data.color || 'Not specified'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Pattern</p>
                    <p className="font-bold text-gray-900 dark:text-white">{data.pattern || 'Not specified'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Expected Delivery</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                        {data.expected_date ? new Date(data.expected_date).toLocaleDateString() : 'Flexible'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Quoted Price</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {data.quoted_price ? `₹${data.quoted_price}` : 'Pending Quote'}
                    </p>
                </div>
            </div>

            {/* UNPACKED: Style Preferences & Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* Style Preferences */}
                {(stylePrefs.fit || stylePrefs.neckline) && (
                    <div>
                        <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3 font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Design Preferences</h3>
                        <ul className="space-y-2">
                            {stylePrefs.fit && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Fit</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{stylePrefs.fit}</span>
                                </li>
                            )}
                            {stylePrefs.neckline && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Neckline / Collar</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{stylePrefs.neckline}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Dynamic Measurements */}
                {Object.keys(measurements).length > 0 && (
                    <div>
                        <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3 font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Measurements (cm)</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.entries(measurements).map(([key, val]) => (
                                <div key={key} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                                    <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Special Instructions */}
            {data.instructions && (
                <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-800/30 mb-8">
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-bold mb-2 flex items-center">
                        <i className="ri-information-line mr-2"></i> Special Instructions
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {data.instructions}
                    </p>
                </div>
            )}

            {/* 🚨 FIXED: Image Gallery mapped to imgObj.image 🚨 */}
            {data.images && data.images.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-semibold">Reference Images</p>
                    <div className="flex flex-wrap gap-4">
                        {data.images.map((imgObj) => (
                            <div key={imgObj.id} className="relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                <img
                                    src={imgObj.image}
                                    alt="Reference"
                                    className="w-32 h-32 md:w-40 md:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}