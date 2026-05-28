import { useMyStitchRequests } from '../hooks/useMyStitchRequests'; // Import your hook

export default function CustomerStitchReqList() {
    // 1. Grab the array of data from your hook
    const { requests, isLoading, fetchError } = useMyStitchRequests();

    // 2. Handle Loading and Error states securely
    if (isLoading) return <div className="p-8 text-center animate-pulse text-purple-500">Loading your wardrobe...</div>;
    if (fetchError) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{fetchError}</div>;
    
    // 3. Handle the empty state (if they haven't ordered anything yet)
    if (requests.length === 0) {
        return (
            <div className="p-12 bg-white dark:bg-gray-800 rounded-2xl text-center shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No active requests</h3>
                <p className="text-gray-500 mt-2">Time to design your next masterpiece!</p>
            </div>
        );
    }

    // 4. THE ASSEMBLY LINE: Use .map() to stamp out a card for every item in the 'requests' array
    return (
        <div className="space-y-4">
            {requests.map((req) => (
                // Every item in a map() needs a unique 'key' so React can track it!
                <div key={req.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center transition-all hover:shadow-md">
                    
                    {/* Left Side: Order Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {req.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Fabric: <span className="font-semibold">{req.fabric}</span> 
                            {req.color && ` • Color: ${req.color}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Submitted on: {new Date(req.submitted_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Right Side: Status Badge */}
                    <div className="text-right">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 uppercase tracking-wide">
                            {req.status.replace('_', ' ')}
                        </span>
                        {/* We will build the detail view later! */}
                        <button className="block w-full mt-3 text-sm text-purple-600 hover:underline">
                            View Details
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}