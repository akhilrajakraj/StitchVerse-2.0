import DesignUploadForm from '../components/DesignUploadForm';

export default function UploadDesignPage() {
    const handleSuccessRedirect = (newDesignId) => {
        console.log(`Design item indexed safely into cloud architecture mapping ID: ${newDesignId}`);
        // Optionally pass this index over into your PortfolioGrid components list to render instantly!
    };

    return (
        <div className="container mx-auto px-4 py-6 font-sans">
            <div className="mb-8">
                <span className="text-xs text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Merchant Workshop
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                    My Studio Catalog
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                    Manage your custom catalog items, upload layout sketches, and customize marketplace details.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form Module Column */}
                <div className="lg:col-span-2">
                    <DesignUploadForm onUploadSuccess={handleSuccessRedirect} />
                </div>

                {/* Auxiliary Guidelines Tip Box Card Column */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <i className="ri-lightbulb-line text-yellow-300 text-xl"></i> Tailor Tips for High Sales
                        </h3>
                        <ul className="space-y-4 text-sm text-blue-100 leading-relaxed">
                            <li className="flex gap-2">
                                <i className="ri-checkbox-circle-fill text-yellow-300 text-base mt-0.5 shrink-0"></i>
                                <span><strong>Be Descriptive:</strong> Clear text terms regarding thread count and fabrics limit returns.</span>
                            </li>
                            <li className="flex gap-2">
                                <i className="ri-checkbox-circle-fill text-yellow-300 text-base mt-0.5 shrink-0"></i>
                                <span><strong>Set Fair Base Fees:</strong> The price listed is for the stitch template base. Extra material custom demands can add markup fees later.</span>
                            </li>
                            <li className="flex gap-2">
                                <i className="ri-checkbox-circle-fill text-yellow-300 text-base mt-0.5 shrink-0"></i>
                                <span><strong>Fast Turnaround:</strong> Accurate specification values enable clients to measure and accept fast orders.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}