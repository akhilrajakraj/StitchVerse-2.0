import { useParams, Link } from 'react-router-dom';
import { useStitchReqDetail } from '../hooks/useStitchReqDetail';
import StitchReqDetailCard from '../components/StitchReqDetailCard';

export default function CustomerStitchReqDetails() {
    // Grab the ID right out of the web browser's URL bar!
    const { id } = useParams(); 
    
    // Hand that ID to our Manager (Hook)
    const { requestData, isLoading, error } = useStitchReqDetail(id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Order Details</h1>
                    <Link to="/customer/dashboard" className="text-purple-600 font-medium">
                        <i className="ri-arrow-left-line mr-2"></i> Back
                    </Link>
                </div>

                {/* Handle the states! */}
                {isLoading && <div className="text-center py-12 animate-pulse text-purple-500">Loading details...</div>}
                {error && <div className="text-center py-12 text-red-500">{error}</div>}
                
                {/* Plop the furniture down, handing it the data! */}
                {!isLoading && !error && requestData && (
                    <StitchReqDetailCard data={requestData} />
                )}

            </div>
        </div>
    );
}