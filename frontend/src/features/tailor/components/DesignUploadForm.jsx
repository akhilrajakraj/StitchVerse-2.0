import { useState, useEffect } from 'react';
import { tailorApi } from '../services/tailorApi';
import { designCatApi } from '../../designs/services/designCatApi'; // 🌟 Clear, isolated database service mapping

export default function DesignUploadForm({ onUploadSuccess }) {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        name: '',
        category: '', // Captures your dynamic database category UUID strings directly
        price: '',
        description: ''
    });

    // Multi-Image Binary & Local Base64 Preview Repositories
    const [selectedImages, setSelectedImages] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]);   
    
    // Dynamic Categories State Box
    const [categories, setCategories] = useState([]); 
    
    // Classy Pop-up Modal State Window
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
    const [isLoading, setIsLoading] = useState(false);

    // --- FETCH LIVE CATEGORIES ON MOUNT (CLEARED INFINITE LOOPS) ---
    useEffect(() => {
        const loadLiveCategories = async () => {
            try {
                const data = await designCatApi.getLiveCategories();
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to fetch live database design categories:", err);
                setCategories([
                    { id: 'err-placeholder', name: 'Failed to load categories from server' }
                ]);
            }
        };
        loadLiveCategories();
    }, []); // 👈 Blank dependency array preserves single-execution boundaries

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- ASYNCHRONOUS LOCAL IMAGE FILE PREVIEW GENERATION ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                return setModal({ isOpen: true, title: 'Invalid File', message: 'Only image files are accepted.', type: 'error' });
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
                setSelectedImages(prev => [...prev, file]);
            };
            reader.readAsDataURL(file);
        });
    };

    // --- REMOVE IMAGE FROM SELECTION CANVASES ---
    const removeImage = (indexToRemove) => {
        setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
        setSelectedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // --- FORM SUBMISSION (WITH MULTI-PART DATA HANDLERS) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.name.length < 3) {
            setIsLoading(false);
            return setModal({ isOpen: true, title: 'Validation Error', message: 'Title must be at least 3 characters long.', type: 'error' });
        }
        if (selectedImages.length === 0) {
            setIsLoading(false);
            return setModal({ isOpen: true, title: 'Missing Visuals', message: 'Please attach at least one sample look image for your customer gallery portfolio.', type: 'error' });
        }

        try {
            // Packages binary files via browser multipart FormData boundaries
            const multiPartForm = new FormData();
            multiPartForm.append('name', formData.name);
            multiPartForm.append('category', formData.category); // Appends raw backend validation UUID strings
            multiPartForm.append('price', parseFloat(formData.price).toFixed(2));
            multiPartForm.append('description', formData.description);
            
            // Append files to match your Django array handlers
            selectedImages.forEach((imageFile) => {
                multiPartForm.append('images', imageFile);
            });

            const data = await tailorApi.uploadDesign(multiPartForm);

            if (data.success) {
                setModal({
                    isOpen: true,
                    title: 'Creation Cataloged! ✨',
                    message: 'Your custom masterpiece pattern has been published onto StitchVerse gallery arrays successfully.',
                    type: 'success'
                });
                setFormData({ name: '', category: '', price: '', description: '' });
                setSelectedImages([]);
                setImagePreviews([]);
                if (onUploadSuccess) onUploadSuccess(data.design_id);
            }
        } catch (err) {
            console.error(err);
            const backendError = err.response?.data?.detail || 'Failed to sync assets with Django models. Check token life parameters.';
            setModal({ isOpen: true, title: 'Upload Failure', message: backendError, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/60 shadow-xl max-w-2xl">
            
            {/* --- CLEAN OVERLAY SYSTEM MODAL WINDOW --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center p-8 border border-transparent dark:border-gray-700 animate-scale-up">
                        <div className="mx-auto mb-4 flex justify-center">
                            {modal.type === 'success' 
                                ? <i className="ri-checkbox-circle-fill text-6xl text-emerald-500"></i>
                                : <i className="ri-error-warning-fill text-6xl text-red-500"></i>
                            }
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{modal.message}</p>
                        <button 
                            type="button"
                            onClick={() => setModal({ ...modal, isOpen: false })}
                            className={`w-full text-white py-3 rounded-xl font-bold transition-all shadow-md ${modal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i className="ri-quill-pen-line text-blue-600 dark:text-blue-400"></i> Catalog New Creation
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Publish your design patterns to showcase your craft and accept custom requests.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Title Input - 🛠️ Associated explicit ids & autocomplete profiles */}
                    <div className="sm:col-span-2">
                        <label htmlFor="design-title" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Creation Title</label>
                        <input 
                            type="text" 
                            id="design-title"
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange}
                            autoComplete="organization-title"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Midnight Blue Velvet Sherwani"
                        />
                    </div>

                    {/* Category Selector - 🛠️ Paired label using htmlFor structural flags */}
                    <div>
                        <label htmlFor="design-category" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Apparel Category</label>
                        <select 
                            id="design-category"
                            name="category" 
                            required 
                            value={formData.category} 
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            <option value="">Select Specialty</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Base Estimated Price - 🛠️ Secured via unique field name indexing */}
                    <div>
                        <label htmlFor="design-price" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Base Stitching Fee (₹)</label>
                        <input 
                            type="number" 
                            id="design-price"
                            name="price" 
                            required 
                            step="0.01" 
                            min="0" 
                            value={formData.price} 
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="4500.00"
                        />
                    </div>

                    {/* --- DYNAMIC MULTI-IMAGE ATTACHMENT BOX --- */}
                    <div className="sm:col-span-2">
                        <label htmlFor="design-gallery-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Apparel Gallery Images</label>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors relative cursor-pointer">
                            <input 
                                type="file" 
                                id="design-gallery-input"
                                name="images"
                                multiple 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <i className="ri-image-add-line text-4xl text-gray-400 dark:text-gray-600 block mb-2"></i>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Click or Drag look images here to upload</span>
                            <span className="block text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG</span>
                        </div>

                        {/* --- CLEAN IMAGE PREVIEW GRID --- */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                {imagePreviews.map((previewUrl, index) => (
                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in">
                                        <img src={previewUrl} alt="Apparel look preview slice" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <button 
                                            type="button" onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-600/90 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-md z-20 cursor-pointer"
                                            title="Delete Image"
                                        >
                                            <i className="ri-delete-bin-line text-sm"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detailed Specifications Box */}
                    <div className="sm:col-span-2">
                        <label htmlFor="design-description" className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Crafting Specifications & Details</label>
                        <textarea 
                            id="design-description"
                            name="description" 
                            required 
                            rows="4" 
                            value={formData.description} 
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Describe fabrics, stitch types, estimated tailoring timelines, and custom alterations patterns allowed..."
                        ></textarea>
                    </div>
                </div>

                <button 
                    type="submit" disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-lg flex justify-center items-center cursor-pointer"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        'Publish Masterpiece to Gallery'
                    )}
                </button>
            </form>
        </div>
    );
}