import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Using the Walkie-Talkie you already built!

function Navbar() {
    const { token, logout } = useAuth(); // Assuming your AuthContext has a token and logout function
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear context
        localStorage.clear(); // Empty the backpack
        navigate('/login'); // Drive back to login
    };

    return (
        <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
            <h1 className="text-2xl font-bold text-blue-500">Tailor Hub</h1>
            <ul className="flex space-x-6 items-center">
                <li><Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link></li>
                <li><Link to="/tailors" className="text-gray-700 hover:text-blue-500">Tailors</Link></li>
                <li><Link to="/orders" className="text-gray-700 hover:text-blue-500">Orders</Link></li>
                
                {/* Conditional Rendering: The React version of PHP's if/else */}
                {token ? (
                    <>
                        <li><Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link></li>
                        <li>
                            <button onClick={handleLogout} className="text-red-500 font-semibold cursor-pointer">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Sign Up</Link></li>
                        <li><Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;