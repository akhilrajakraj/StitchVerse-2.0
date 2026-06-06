export default function StitchReqDetailCard({ data }) {
    
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.name}</h2>
                    <p className="text-gray-500">{data.garment_type?.name} • {data.fabric}</p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-700 uppercase">
                    {data.status.replace('_', ' ')}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold dark:text-white">{data.color || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Pattern</p>
                    <p className="font-semibold dark:text-white">{data.pattern || 'N/A'}</p>
                </div>
            </div>

            {data.instructions && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-semibold mb-1">Special Instructions</p>
                    <p className="text-gray-700 dark:text-gray-300">{data.instructions}</p>
                </div>
            )}

            {data.images && data.images.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm text-gray-500 font-semibold mb-2">Reference Images</p>
                    <div className="grid grid-cols-3 gap-4">
                        {data.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Reference ${index + 1}`}
                                className="rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Garment Type</p>
                    <p className="font-semibold dark:text-white">{data.garment_type?.name || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Fabric</p>
                    <p className="font-semibold dark:text-white">{data.fabric || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Color</p>
                    <p className="font-semibold dark:text-white">{data.instructions || 'N/A'}</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">

            </div>
        </div>
    );
}