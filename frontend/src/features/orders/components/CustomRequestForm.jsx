import { useState } from 'react';
import { useCustomRequest } from '../hooks/useCustomRequest';

export default function CustomRequestForm() {
    // 1. Bring in the Upgraded Store Manager
    // Defensive Programming: We default categories to an empty array [] to prevent map() crashes!
    const { 
        categories = [], 
        isFetchingCategories, 
        fetchError, 
        submitRequest, 
        isSubmitting, 
        submitError, 
        isSuccess 
    } = useCustomRequest();

    // 2. Standard Text Inputs (Now with Color, Pattern, Instructions, and Date!)
    const [requestName, setRequestName] = useState('');
    const [fabric, setFabric] = useState('');
    const [color, setColor] = useState('');
    const [pattern, setPattern] = useState('');
    const [instructions, setInstructions] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [images, setImages] = useState([]);
    
    // 3. The Dynamic States
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [dynamicMeasurements, setDynamicMeasurements] = useState({});

    // Defensive Check: Safely find the category only if the array actually exists
    const selectedCategory = categories?.find(c => c.id === selectedCategoryId) || null;

    // 4. The Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const payload = new FormData();

        // Required Fields
        payload.append('name', requestName);
        payload.append('garment_type', selectedCategoryId);
        payload.append('fabric', fabric);
        
        // Optional Fields: Only append them if the user actually typed something!
        if (color) payload.append('color', color);
        if (pattern) payload.append('pattern', pattern);
        if (instructions) payload.append('instructions', instructions);
        if (expectedDate) payload.append('expected_date', expectedDate);
        
        // Dynamic JSON Measurements
        const finalDesignDetails = { measurements: dynamicMeasurements };
        payload.append('design_details', JSON.stringify(finalDesignDetails));

        // Images
        images.forEach((image) => {
            payload.append('uploaded_images', image);
        });

        try {
            await submitRequest(payload);
        } catch (err) {
            console.log("Form caught submission error", err);
        }
    };

    // 5. The Isolated Form UI (The Furniture)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 md:p-8">
                
                {/* SAFE LOADING STATE */}
                {isFetchingCategories ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <i className="ri-loader-4-line animate-spin text-4xl text-purple-500 mb-4"></i>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading garment catalog...</p>
                    </div>
                ) : fetchError ? (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-xl text-center">
                        {fetchError}
                    </div>
                ) : isSuccess ? (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-8 text-center animate-pulse">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-check-line text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Sent Successfully!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Your design details have been securely transmitted to the artisan registry.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                        >
                            Create Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                        
                        {submitError && (
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 rounded-xl flex items-start">
                                <i className="ri-error-warning-line text-xl mr-3 mt-0.5"></i>
                                <div>
                                    <h4 className="font-bold">Submission Failed</h4>
                                    <p className="text-sm mt-1">{submitError}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* OUTFIT SELECTOR */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Outfit Type <span className="text-red-500">*</span></label>
                                <select 
                                    required
                                    value={selectedCategoryId}
                                    onChange={(e) => {
                                        setSelectedCategoryId(e.target.value);
                                        setDynamicMeasurements({}); 
                                    }}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none appearance-none"
                                >
                                    <option value="">-- Choose a Garment --</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.department} - {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DYNAMIC MEASUREMENT POP-OUT */}
                            {selectedCategory && selectedCategory.required_measurements?.length > 0 && (
                                <div className="md:col-span-2 p-5 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl transition-all duration-500 ease-in-out">
                                    <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center text-sm md:text-base">
                                        <i className="ri-ruler-line mr-2 text-lg"></i> Required Measurements (cm) <span className="text-red-500 ml-1">*</span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedCategory.required_measurements.map((measureKey) => (
                                            <div key={measureKey}>
                                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 capitalize mb-1.5">
                                                    {measureKey.replace(/_/g, ' ')}
                                                </label>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    required
                                                    value={dynamicMeasurements[measureKey] || ''}
                                                    onChange={(e) => setDynamicMeasurements({
                                                        ...dynamicMeasurements, 
                                                        [measureKey]: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm md:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                                    placeholder="0.0"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Standard Core Inputs */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Give Your Request a Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={requestName}
                                    onChange={(e) => setRequestName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                    placeholder="e.g., Summer Linen Kurti for Diwali"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fabric Preference <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={fabric}
                                    onChange={(e) => setFabric(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                    placeholder="e.g., Egyptian Cotton"
                                />
                            </div>

                            {/* NEW: Color and Pattern */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color (Optional)</label>
                                <input 
                                    type="text" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                    placeholder="e.g., Navy Blue"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pattern (Optional)</label>
                                <input 
                                    type="text" 
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                    placeholder="e.g., Solid, Floral, Stripes"
                                />
                            </div>

                            {/* NEW: Expected Delivery Date */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desired Delivery Date (Optional)</label>
                                <input 
                                    type="date" 
                                    value={expectedDate}
                                    min={new Date().toISOString().split('T')[0]} // Prevents picking past dates!
                                    onChange={(e) => setExpectedDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                />
                            </div>

                            {/* NEW: Special Instructions */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Special Instructions (Optional)</label>
                                <textarea 
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                                    placeholder="e.g., Please add extra lining, make the collar slightly wider..."
                                ></textarea>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 md:pt-8">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Reference Images (Optional)</label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <i className="ri-upload-cloud-2-line text-3xl md:text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
                                        <p className="mb-1 md:mb-2 text-xs md:text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        {images.length > 0 && (
                                            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-2">{images.length} file(s) selected</p>
                                        )}
                                    </div>
                                    <input 
                                        id="dropzone-file" 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={(e) => setImages(Array.from(e.target.files))}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 md:pt-8 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting || isFetchingCategories}
                                className={`w-full md:w-auto px-8 py-3.5 md:py-3 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-500/30 transition-all flex justify-center items-center gap-2 transform md:hover:-translate-y-0.5
                                    ${isSubmitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin text-xl"></i> Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-send-plane-fill text-xl"></i> Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}