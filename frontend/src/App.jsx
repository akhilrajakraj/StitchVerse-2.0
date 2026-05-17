import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// 2. Import our newly separated Layouts!
import MainLayout from './layouts/MainLayout';
import TailorLayout from './layouts/TailorLayout';

// 3. Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/CustomRegister';
import TailorRegisterPage from './pages/TailorRegister';
import TailorLandingPage from './pages/TailorLandingPage';

// 4. Private Dashboards
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboard';
// import TailorDashboardPage from './pages/TailorDashboard'; // We will build this next!

// 5. Bouncer
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        
                        {/* 🟢 CUSTOMER / PUBLIC ROUTING TREE */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/for-tailors" element={<TailorLandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/register/tailor" element={<TailorRegisterPage />} />
                            
                            <Route 
                                path="/dashboard" 
                                element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} 
                            />
                        </Route>

                        {/* 🔵 TAILOR ROUTING TREE */}
                        <Route element={<TailorLayout />}>
                            {/* <Route  */}
                            {/* path="/tailor/dashboard"  */}
                            {/* element={<ProtectedRoute><TailorDashboardPage /></ProtectedRoute>}  */}
                            {/* /> */}
                        </Route>

                        {/* 🔴 ADMIN ROUTING TREE (No Layout!) */}
                        <Route 
                            path="/admin/dashboard" 
                            element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} 
                        />

                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;