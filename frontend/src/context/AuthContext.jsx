/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useContext } from 'react';

// 1. Create the Walkie-Talkie Channel
const AuthContext = createContext();

// 2. The Headquarters (Provider)
export const AuthProvider = ({ children }) => {
    
    // Check the backpack (localStorage) IMMEDIATELY when the app starts!
    // This runs before the screen even paints.
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        
        if (token && role) {
            return { token: token, role: role };
        }
        return null;
    });
    
    // Because we check localStorage instantly, we never actually need to "load"
    // We just keep this variable as false so your ProtectedRoute doesn't break!
    const loading = false;

    // Function to run when a user successfully logs in
    const login = (userData) => {
        setUser(userData);
    };

    // Function to run when a user clicks "Logout"
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* The 'children' is your entire React app */}
            {children} 
        </AuthContext.Provider>
    );
};

// 3. The Hook (This makes it easy for other pages to grab the Walkie-Talkie)
export const useAuth = () => {
    return useContext(AuthContext);
};