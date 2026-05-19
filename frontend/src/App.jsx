import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Global context data streams
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Master routing orchestrator
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    {/* All workflows load dynamically through here! */}
                    <AppRoutes />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;