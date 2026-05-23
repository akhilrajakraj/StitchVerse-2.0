import { useState, useEffect } from 'react';
// Make sure you have getProfile and updateProfile added to your customerApi.js!
import { customerApi } from '../services/customerApi'; 

export default function CustomerProfile() {
    // 🌟 1. State matches models.py exactly (No tailor bio or specialisation)
    const [formData, setFormData] = useState({
        full_name: '', 
        phone: '',
        address: { 
            line1: '', 
            line2: '', 
            city: '', 
            district: '', 
            state: 'Kerala', // Default from models.py
            pincode: '', 
            country: 'India' // Default from models.py
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

    // Load existing database data on mount
    useEffect(() => {
        const loadCustomerProfile = async () => {
            try {
                // Ensure customerApi has this method built identically to the tailor one!
                const result = await customerApi.getProfile(); 
                if (result.success && result.data) {
                    const p = result.data;
                    setFormData({
                        full_name: p.full_name || '',
                        phone: p.phone || '',
                        address: {
                            line1: p.address?.line1 || '',
                            line2: p.address?.line2 || '',
                            city: p.address?.city || '',
                            district: p.address?.district || '',
                            state: p.address?.state || 'Kerala',
                            pincode: p.address?.pincode || '',
                            country: p.address?.country || 'India'
                        }
                    });
                }
            } catch (err) {
                console.error(err);
                setModal({ isOpen: true, title: 'Error', message: 'Failed to read profile details from backend.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        loadCustomerProfile();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 🛠️ Flattening payload if your backend serializer requires it
            const flatPayload = {
                full_name: formData.full_name,
                phone: formData.phone,
                line1: formData.address.line1,
                line2: formData.address.line2,
                city: formData.address.city,
                district: formData.address.district,
                state: formData.address.state,
                pincode: formData.address.pincode,
                country: formData.address.country
            };

            const result = await customerApi.updateProfile(flatPayload);
            if (result.success) {
                setModal({ isOpen: true, title: 'Success! ✨', message: 'Your personal details have been updated successfully.', type: 'success' });
            }
        } catch (err) {
            console.error("Profile payload update failure:", err);
            const errMsg = err.response?.data?.detail || 'Field validation failure. Verify your inputs.';
            setModal({ isOpen: true, title: 'Update Failed', message: errMsg, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl font-sans">
            
            {/* Pop-up Modals - 🌟 Switched to Purple theme for customer side */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-700">
                        <i className={`ri-${modal.type === 'success' ? 'checkbox-circle' : 'error-warning'}-fill text-5xl mb-2 block ${modal.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}></i>
                        <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{modal.message}</p>
                        <button type="button" onClick={() => setModal({ ...modal, isOpen: false })} className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-colors">Confirm</button>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Account Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your personal details and default shipping address.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                
                {/* --- PERSONAL DETAILS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="full_name" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" id="full_name" name="full_name" required value={formData.full_name} onChange={handleChange} autoComplete="name" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. John Doe" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required maxLength="15" value={formData.phone} onChange={handleChange} autoComplete="tel" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                    </div>

                    {/* --- SHIPPING ADDRESS --- */}
                    <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                        <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <i className="ri-map-pin-line text-purple-500"></i> Default Shipping Address
                        </h3>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="addr-line1" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">House No, Building, Street</label>
                        <input type="text" id="addr-line1" name="addr-line1" required value={formData.address.line1} onChange={handleChange} autoComplete="address-line1" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="addr-line2" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Area, Colony, Landmark (Optional)</label>
                        <input type="text" id="addr-line2" name="addr-line2" value={formData.address.line2} onChange={handleChange} autoComplete="address-line2" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="addr-city" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">City / Town</label>
                        <input type="text" id="addr-city" name="addr-city" required value={formData.address.city} onChange={handleChange} autoComplete="address-level2" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="addr-district" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">District</label>
                        <input type="text" id="addr-district" name="addr-district" required value={formData.address.district} onChange={handleChange} className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="addr-state" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">State</label>
                        <input type="text" id="addr-state" name="addr-state" required value={formData.address.state} onChange={handleChange} autoComplete="address-level1" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="addr-pincode" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Pincode</label>
                        <input type="text" id="addr-pincode" name="addr-pincode" required maxLength="6" value={formData.address.pincode} onChange={handleChange} autoComplete="postal-code" className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    
                    <div className="sm:col-span-2 hidden">
                        <input type="hidden" name="addr-country" value={formData.address.country} />
                    </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold text-md hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 flex justify-center items-center cursor-pointer disabled:bg-purple-400">
                    {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Save Profile Changes'}
                </button>
            </form>
        </div>
    );
}