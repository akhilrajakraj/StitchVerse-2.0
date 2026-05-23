import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Import your local background image
import bgImage from '../../../assets/images/backgroundindex.jpg';

export default function LoginPage() {
    // 1. Grab our Walkie-Talkie and Steering Wheel
    const { login } = useAuth();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    
    // The beautiful Modal State instead of ugly alerts!
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'error' });

    // --- HANDLERS ---
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send the knock to the Django Bouncer
            const response = await axios.post(
                'http://localhost:8000/api/v1/accounts/login/',
                formData
            );

            const userRole = response.data.user.role;
            const userName = response.data.user.full_name || 'User';

            // 2. Put the tokens and metadata safely in the backpack (localStorage)
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_role', userRole);
            localStorage.setItem('full_name', userName);

            // 3. Broadcast to the rest of the app that you are logged in!
            login({
                token: response.data.access,
                role: userRole,
                full_name: userName
            });

            // 4. Show success modal
            setModal({ 
                isOpen: true, 
                title: 'Welcome Back!', 
                message: `Login successful. Taking you to your workspace...`, 
                type: 'success' 
            });
            
            // 5. THE ULTIMATE ROLE-BASED TRAFFIC COP CONTROLLER 🚦
            setTimeout(() => {
                switch (userRole) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'staff':
                        navigate('/staff/dashboard');
                        break;
                    case 'tailor':
                        navigate('/tailor/dashboard');
                        break;
                    case 'delivery':
                        navigate('/delivery/dashboard');
                        break;
                    case 'support':
                        navigate('/support/dashboard');
                        break;
                    case 'customer':
                    default:
                        navigate('/customer/dashboard'); // Standard Customer view dashboard
                        break;
                }
            }, 1500);

        } catch (error) {
            console.error('Login Error:', error);

            // If Django catches a wrong password or email, it usually sends a "detail" key
            let errorMessage = "Could not connect to the server. Is Django running?";
            
            if (error.response && error.response.data) {
                // DRF SimpleJWT usually puts the error in the 'detail' field
                errorMessage = error.response.data.detail || "Invalid email or password.";
            }

            // Pop up the beautiful error modal!
            setModal({ 
                isOpen: true, 
                title: 'Login Failed', 
                message: errorMessage, 
                type: 'error' 
            });
        }
    };

    return (
        <main 
            className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Dark Mode Overlay */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/75 transition-colors duration-300" />

            {/* --- BEAUTIFUL POP-UP MODAL --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center p-8 transform transition-all scale-105 border border-transparent dark:border-gray-700">
                        <div className="mx-auto mb-4 flex justify-center">
                            {modal.type === 'success' 
                                ? <i className="ri-checkbox-circle-line text-6xl text-green-500 animate-bounce"></i>
                                : <i className="ri-error-warning-line text-6xl text-red-500 animate-pulse"></i>
                            }
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">{modal.message}</p>
                        
                        {/* Only show the OK button if it's an error (Success auto-redirects) */}
                        {modal.type === 'error' && (
                            <button 
                                onClick={() => setModal({ ...modal, isOpen: false })}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* --- LOGIN CARD --- */}
            <div className="w-full max-w-md mx-auto p-8 md:p-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl relative z-10 border border-white/20 dark:border-gray-700/50">
                <div className="text-center mb-8">
                    <Link to="/" className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 block" style={{fontFamily: 'Pacifico, serif'}}>
                        StitchVerse
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back!</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <i className="ri-mail-line text-gray-400 text-lg"></i>
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                                placeholder="you@example.com" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <i className="ri-lock-line text-gray-400 text-lg"></i>
                            </div>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-500 transition-colors"
                            >
                                <i className={`ri-eye-${showPassword ? 'line' : 'off-line'} text-xl`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right -mt-2">
                        <Link to="/forgot-password" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                    >
                        Login to Dashboard
                    </button>

                    {/* Registration Links */}
                    <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account? <br className="sm:hidden" />
                        <Link to="/register" className="font-bold text-purple-600 dark:text-purple-400 hover:underline ml-1">
                            Register as Customer
                        </Link> 
                        <span className="mx-2">or</span>
                        <Link to="/for-tailors" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
                            as Tailor
                        </Link>.
                    </div>
                </form>
            </div>
        </main>
    );
}