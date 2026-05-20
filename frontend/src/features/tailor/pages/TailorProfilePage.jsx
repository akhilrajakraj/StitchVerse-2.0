import { useState, useEffect } from 'react';
import { tailorApi } from '../services/tailorApi';

export default function TailorProfilePage() {
    const [formData, setFormData] = useState({
        full_name: '', phone: '', specialisation: '', qualification: '', bio: '',
        address: { line1: '', city: '', district: '', pincode: '' }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

    // Load existing database data on mount
    useEffect(() => {
        const loadTailorProfile = async () => {
            try {
                const result = await tailorApi.getProfile();
                if (result.success && result.data) {
                    const p = result.data;
                    setFormData({
                        full_name: p.full_name || '',
                        phone: p.phone || '',
                        specialisation: p.specialisation || '',
                        qualification: p.qualification || '',
                        bio: p.bio || '',
                        address: {
                            line1: p.address?.line1 || '',
                            city: p.address?.city || '',
                            district: p.address?.district || '',
                            pincode: p.address?.pincode || ''
                        }
                    });
                }
            } catch (err) {
                console.error(err);
                setModal({ isOpen: true, title: 'Error', message: 'Failed to read profile details from backend database.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        loadTailorProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('addr-')) {
            const field = name.replace('addr-', '');
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 🌟 THE MAJESTIC FULL-STACK FIX IS RIGHT HERE!
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 🛠️ Flattening the data properties to feed straight into your fields mapping!
            // This stops sending a nested object block, matching your model configurations.
            const flatPayload = {
                full_name: formData.full_name,
                phone: formData.phone,
                specialisation: formData.specialisation,
                qualification: formData.qualification,
                bio: formData.bio
            };

            const result = await tailorApi.updateProfile(flatPayload);
            if (result.success) {
                setModal({ isOpen: true, title: 'Success! ✨', message: 'Your artisan specifications have been updated successfully.', type: 'success' });
            }
        } catch (err) {
            console.error("Profile payload update failure:", err);
            const errMsg = err.response?.data?.detail || 'Field validation failure. Verify input limits.';
            setModal({ isOpen: true, title: 'Update Failed', message: errMsg, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl font-sans">
            {/* Pop-up Modals */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-700">
                        <i className={`ri-${modal.type === 'success' ? 'checkbox-circle' : 'error-warning'}-fill text-5xl mb-2 block ${modal.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}></i>
                        <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{modal.message}</p>
                        <button type="button" onClick={() => setModal({ ...modal, isOpen: false })} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors">Confirm</button>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Studio Profile Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your professional credentials, tailoring specialties, and workshop location.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Public Artisan Name</label>
                        <input type="text" id="full_name" name="full_name" required value={formData.full_name} onChange={handleChange} autoComplete="name" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Phone Contact */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Contact Number</label>
                        <input type="tel" id="phone" name="phone" required maxLength="15" value={formData.phone} onChange={handleChange} autoComplete="tel" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Specialization Options */}
                    <div>
                        <label htmlFor="specialisation" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Crafting Specialty</label>
                        <input type="text" id="specialisation" name="specialisation" required value={formData.specialisation} onChange={handleChange} placeholder="e.g., Wedding Lehengas, Men's Suits" autoComplete="off" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Qualification Dropdown Menu */}
                    <div>
                        <label htmlFor="qualification" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Accreditation Level</label>
                        <select id="qualification" name="qualification" required value={formData.qualification} onChange={handleChange} className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                            <option value="diploma">Diploma in Fashion</option>
                            <option value="bsc_fashion_design">B.Sc Fashion Design</option>
                            <option value="ba_costume_design">B.A Costume Design</option>
                            <option value="pg_fashion_design">P.G Fashion Design</option>
                            <option value="5_years_experience">5 Years Experience</option>
                            <option value="10_years_experience">10 Years Experience</option>
                            <option value="other">Other / Self-Taught</option>
                        </select>
                    </div>

                    {/* Bio Field */}
                    <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Studio Biography</label>
                        <textarea id="bio" name="bio" rows="3" value={formData.bio} onChange={handleChange} placeholder="Introduce your shop history, technique styles, and fabric preferences to your prospective clients..." autoComplete="off" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                    </div>

                    {/* Section Header Divider */}
                    <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                        <h3 className="text-md font-bold text-gray-900 dark:text-white">Workshop Physical Address</h3>
                    </div>

                    {/* Address Line 1 */}
                    <div className="sm:col-span-2">
                        <label htmlFor="addr-line1" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Street / Suite / Building Address</label>
                        <input type="text" id="addr-line1" name="addr-line1" required value={formData.address.line1} onChange={handleChange} autoComplete="address-line1" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* City */}
                    <div>
                        <label htmlFor="addr-city" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">City / Town</label>
                        <input type="text" id="addr-city" name="addr-city" required value={formData.address.city} onChange={handleChange} autoComplete="address-level2" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Pincode */}
                    <div>
                        <label htmlFor="addr-pincode" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Postal Pincode</label>
                        <input type="text" id="addr-pincode" name="addr-pincode" required maxLength="6" value={formData.address.pincode} onChange={handleChange} autoComplete="postal-code" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-md hover:bg-blue-700 transition-all shadow-lg flex justify-center items-center cursor-pointer disabled:bg-blue-400">
                    {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Save Profile Adjustments'}
                </button>
            </form>
        </div>
    );
}