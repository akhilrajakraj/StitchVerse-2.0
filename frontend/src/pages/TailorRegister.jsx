import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import your local background image!
import bgImage from '../assets/images/backgroundindex.jpg';

export default function TailorRegisterPage() {
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        tname: '', email: '', address: '', city: '', distri: '', pinc: '', phone: '', spect: '', quali: '', password: '', confirm_password: '', terms: false
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Modal State
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });

    // --- LIVE VALIDATION LOGIC ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Password Criteria Checkers
    const pwCriteria = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        symbol: /[^A-Za-z0-9]/.test(formData.password)
    };
    const isPasswordValid = Object.values(pwCriteria).every(Boolean);

    // --- FORM SUBMISSION (THE BRIDGE TO DJANGO) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Basic Frontend Checks
        if (!formData.terms) {
            return setModal({ isOpen: true, title: 'Error', message: 'You must accept the Terms and Conditions.', type: 'error' });
        }
        if (!isPasswordValid) {
            return setModal({ isOpen: true, title: 'Weak Password', message: 'Please ensure your password meets all requirements.', type: 'error' });
        }
        if (formData.password !== formData.confirm_password) {
            return setModal({ isOpen: true, title: 'Mismatch', message: 'Your passwords do not match.', type: 'error' });
        }
        if (!/@(gmail\.com|google\.com)$/i.test(formData.email)) {
            return setModal({ isOpen: true, title: 'Invalid Email', message: 'Only Gmail accounts are accepted.', type: 'error' });
        }

        // 2. Shape the Data exactly for Django DRF Tailor API
        const payload = {
            email: formData.email,
            password: formData.password,
            full_name: formData.tname,
            phone: formData.phone,
            address: {
                line1: formData.address,
                line2: '', // Preventing the NOT NULL constraint error!
                city: formData.city,
                district: formData.distri,
                pincode: formData.pinc
            },
            specialisation: formData.spect,
            qualification: formData.quali,
            bio: '' // Leaving blank as per original PHP form
        };

        // 3. Send to Backend
        try {
            const response = await fetch('http://localhost:8000/api/v1/tailors/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Tailor accounts are PENDING in Django, so we tell the user!
                setModal({ 
                    isOpen: true, 
                    title: 'Application Submitted!', 
                    message: 'Your tailor account has been created and is pending admin approval. Redirecting to home...', 
                    type: 'success' 
                });
                setTimeout(() => navigate('/'), 3000);
            } else {
                // Backend rejected it
                const errorMsg = data.email ? data.email[0] : 'Registration failed. Please try again.';
                setModal({ isOpen: true, title: 'Registration Failed', message: errorMsg, type: 'error' });
            }
        } catch (error) {
            console.error("Tailor Registration failed to connect:", error);
            setModal({ isOpen: true, title: 'Server Error', message: 'Could not connect to the server. Is Django running?', type: 'error' });
        }
    };

    return (
        <main 
            className="min-h-screen flex items-center justify-center py-24 px-4 bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Dark Mode Overlay */}
            <div className="absolute inset-0 bg-blue-900/40 dark:bg-black/70 transition-colors duration-300" />

            {/* --- BEAUTIFUL POP-UP MODAL --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto text-center p-8 transform transition-all scale-105 border border-transparent dark:border-gray-700">
                        <div className="mx-auto mb-4 flex justify-center">
                            {modal.type === 'success' 
                                ? <i className="ri-checkbox-circle-line text-6xl text-green-500 animate-bounce"></i>
                                : <i className="ri-error-warning-line text-6xl text-red-500 animate-pulse"></i>
                            }
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">{modal.message}</p>
                        <button 
                            onClick={() => setModal({ ...modal, isOpen: false })}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* --- MAIN REGISTRATION FORM --- */}
            <div className="w-full max-w-3xl mx-auto p-8 md:p-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl relative z-10 border border-white/20 dark:border-gray-700/50">
                
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Join as a Professional Tailor</h2>
                    <p className="text-gray-600 dark:text-gray-400">Showcase your craft to a global audience on StitchVerse.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Business Name */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name / Business Name</label>
                            <input 
                                type="text" name="tname" required value={formData.tname} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Your Business Name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Business Email (Gmail Only)</label>
                            <input 
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="contact@gmail.com"
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Full Address</label>
                            <textarea 
                                name="address" required rows="2" value={formData.address} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Shop No, Street, Landmark"
                            ></textarea>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">City / Town</label>
                            <input 
                                type="text" name="city" required value={formData.city} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., Mavelikara"
                            />
                        </div>

                        {/* District */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">District</label>
                            <select 
                                name="distri" required value={formData.distri} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">Select District</option>
                                {['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">6-Digit Pincode</label>
                            <input 
                                type="text" name="pinc" required maxLength="6" value={formData.pinc} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="690101"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">10-Digit Phone Number</label>
                            <input 
                                type="tel" name="phone" required maxLength="10" value={formData.phone} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="9876543210"
                            />
                        </div>

                        {/* Speciality */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Speciality</label>
                            <select 
                                name="spect" required value={formData.spect} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">Select Speciality</option>
                                {['All', 'Traditional', 'Formal', 'Casuals', 'Uniform', 'Bride & Groom wear'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Qualification - Mapped EXACTLY to Django Models */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Qualification / Experience</label>
                            <select 
                                name="quali" required value={formData.quali} onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">-- Select Qualification --</option>
                                <option value="diploma">Diploma in Fashion</option>
                                <option value="bsc_fashion_design">B.Sc Fashion Design</option>
                                <option value="ba_costume_design">B.A Costume Design</option>
                                <option value="pg_fashion_design">P.G Fashion Design</option>
                                <option value="5_years_experience">5 Years Experience</option>
                                <option value="10_years_experience">10 Years Experience</option>
                                <option value="other">Other / Self-Taught</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                                    className="w-full p-4 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-blue-500">
                                    <i className={`ri-eye-${showPassword ? 'line' : 'off-line'} text-xl`}></i>
                                </button>
                            </div>
                            
                            {formData.password.length > 0 && (
                                <ul className="mt-3 space-y-1 text-xs">
                                    <li className={`transition-colors ${pwCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                                        <i className={`mr-1 ri-${pwCriteria.length ? 'check-line' : 'close-line'}`}></i> At least 8 characters
                                    </li>
                                    <li className={`transition-colors ${pwCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                                        <i className={`mr-1 ri-${pwCriteria.uppercase ? 'check-line' : 'close-line'}`}></i> One uppercase letter
                                    </li>
                                    <li className={`transition-colors ${pwCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                                        <i className={`mr-1 ri-${pwCriteria.lowercase ? 'check-line' : 'close-line'}`}></i> One lowercase letter
                                    </li>
                                    <li className={`transition-colors ${pwCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                                        <i className={`mr-1 ri-${pwCriteria.number ? 'check-line' : 'close-line'}`}></i> One number
                                    </li>
                                    <li className={`transition-colors ${pwCriteria.symbol ? 'text-green-500' : 'text-red-500'}`}>
                                        <i className={`mr-1 ri-${pwCriteria.symbol ? 'check-line' : 'close-line'}`}></i> One special character
                                    </li>
                                </ul>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" required value={formData.confirm_password} onChange={handleChange}
                                    className={`w-full p-4 pr-12 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formData.confirm_password && formData.password !== formData.confirm_password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-blue-500">
                                    <i className={`ri-eye-${showConfirmPassword ? 'line' : 'off-line'} text-xl`}></i>
                                </button>
                            </div>
                            {formData.confirm_password && formData.password !== formData.confirm_password && (
                                <p className="text-red-500 text-xs mt-2">Passwords do not match.</p>
                            )}
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start mt-6">
                        <div className="flex items-center h-5">
                            <input 
                                type="checkbox" name="terms" required checked={formData.terms} onChange={handleChange}
                                className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 cursor-pointer" 
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label className="font-medium text-gray-600 dark:text-gray-400">
                                I accept the <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</Link>
                            </label>
                        </div>
                    </div>

                    {/* Notice the color change! We use blue for Tailor specific branding */}
                    <button 
                        type="submit" 
                        className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                    >
                        Submit Application
                    </button> 

                    <div className="text-center mt-8 text-gray-600 dark:text-gray-400"> 
                        Already have an account? {' '}
                        <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">Login Now</Link> 
                    </div> 
                </form> 
            </div> 
        </main>
    );
}