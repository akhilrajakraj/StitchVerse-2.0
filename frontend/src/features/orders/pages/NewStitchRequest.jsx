import { Link } from 'react-router-dom';
import CustomRequestForm from '../components/CustomRequestForm'; // Adjust path if needed

export default function NewStitchRequestPage() {
    return (
        /* The Room: Handles the full screen, background color, and padding */
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* The Top Navigation & Title Bar */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                            Create a Stitch Request
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                            Describe your dream outfit and let our tailors bring it to life.
                        </p>
                    </div>
                    <Link 
                        to="/customer/dashboard" 
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                    >
                        <i className="ri-arrow-left-line mr-2"></i> Back to Dashboard
                    </Link>
                </div>

                {/* The Furniture: We drop our isolated form component right here */}
                <div className="max-w-4xl mx-auto">
                    <CustomRequestForm />
                </div>

            </div>
        </div>
    );
}