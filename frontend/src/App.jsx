import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// 2. Import our separated Layouts! (The persistent structural containers)
import MainLayout from './layouts/MainLayout';
import TailorLayout from './layouts/TailorLayout';
import AdminLayout from './layouts/AdminLayout'; // 👈 Imported our newly structured Admin layout

// 3. Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/CustomRegister';
import TailorRegisterPage from './pages/TailorRegister';
import TailorLandingPage from './pages/TailorLandingPage';

// 4. Private Dashboards & Management Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboard';
// import TailorDashboardPage from './pages/TailorDashboard'; // (Uncomment when built!)
// import AdminTailorsManagementPage from './pages/AdminTailorsManagementPage'; // (Uncomment when built!)

// 5. Bouncer (Route Guardians)
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        
                        {/* 🟢 CUSTOMER / PUBLIC ROUTING TREE (Has Header & Footer Sandwich) */}
                        <Route element={<MainLayout />}>
                            {/* Public Facing Pages */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/for-tailors" element={<TailorLandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/register/tailor" element={<TailorRegisterPage />} />
                            
                            {/* Authenticated Customer Pages */}
                            <Route 
                                path="/dashboard" 
                                element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} 
                            />
                            
                            {/* 💡 DEVELOPER NOTICE (CUSTOMER EXPANSION):
                                Want to add more Customer Workspace pages (e.g., My Measurements, View Order Details)? 
                                Simply add them below this line like this:
                                <Route path="/measurements" element={<ProtectedRoute><MyMeasurementsPage /></ProtectedRoute>} />
                                <Route path="/orders/designs" element={<ProtectedRoute><DesignOrdersPage /></ProtectedRoute>} />
                            */}
                        </Route>


                        {/* 🔵 TAILOR ROUTING TREE (Has specialized Blue Tailor Header + Footer) */}
                        <Route element={<TailorLayout />}>
                            {/* 💡 DEVELOPER NOTICE (TAILOR EXPANSION):
                                Once you build the Tailor components, uncomment and drop them inside this tree 
                                so they automatically absorb the tailor layout framework shell!
                                
                                <Route 
                                    path="/tailor/dashboard" 
                                    element={<ProtectedRoute><TailorDashboardPage /></ProtectedRoute>} 
                                />
                                <Route 
                                    path="/tailor/portfolio" 
                                    element={<ProtectedRoute><TailorPortfolioUploadPage /></ProtectedRoute>} 
                                />
                            */}
                        </Route>


                        {/* 🔴 ADMIN ROUTING TREE (Has specialized full-screen Command Center Sidebar Layout) */}
                        <Route element={<AdminLayout />}>
                            {/* Admin Overview Stats Analytics Canvas */}
                            <Route 
                                path="/admin/dashboard" 
                                element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} 
                            />
                            
                            {/* 💡 DEVELOPER NOTICE (ADMIN EXPANSION):
                                This block acts as your Admin Command Center ecosystem tree. 
                                When adding sub-modules like Customer management, Design listings, or Order pipelines, 
                                drop them right here under the protection layer:
                                
                                1. Manage Tailors Approval Queue:
                                <Route path="/admin/tailors" element={<ProtectedRoute><AdminTailorsManagementPage /></ProtectedRoute>} />
                                
                                2. Manage Platform Customers Profile Lists:
                                <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomersManagementPage /></ProtectedRoute>} />
                                
                                3. Global Order Tracking & Platform Escrow Pipelines:
                                <Route path="/admin/orders" element={<ProtectedRoute><AdminGlobalOrdersPage /></ProtectedRoute>} />
                            */}
                        </Route>


                        {/* 🟡 FUTURE MODULE EXPANSIONS (Staff, Support Dispatch, Delivery Logistics Agents)
                            As StitchVerse 2.0 scales, you can create separate layout sheets for these roles 
                            and easily map them beneath this notice without breaking any current modules:
                            
                            <Route element={<DeliveryLayout />}>
                                <Route path="/delivery/dashboard" element={<ProtectedRoute><DeliveryAgentDashboard /></ProtectedRoute>} />
                            </Route>
                            
                            <Route element={<SupportLayout />}>
                                <Route path="/support/dashboard" element={<ProtectedRoute><SupportTicketDashboard /></ProtectedRoute>} />
                            </Route>
                        */}

                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;