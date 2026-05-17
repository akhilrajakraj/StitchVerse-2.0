import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    // 1. Listen to the Walkie-Talkie
    const { user, loading } = useAuth();

    // 2. Wait a split second while we check localStorage
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h2>Loading... ⏳</h2>
            </div>
        ); 
    }

    // 3. The Bouncer Logic: No user data? Go straight to the login line.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 4. VIP access granted! Let them see the protected page (the 'children')
    return children;
}

export default ProtectedRoute;