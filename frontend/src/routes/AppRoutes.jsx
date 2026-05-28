import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Layout Structural Wrappers (Persisting shells inside shared/)
import MainLayout from '../shared/layouts/MainLayout';
import TailorLayout from '../shared/layouts/TailorLayout';
import AdminLayout from '../shared/layouts/AdminLayout';

// 2. Core Authentication Feature Pages (sitting in features/auth/pages/)
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/CustomRegister';
import TailorRegister from '../features/auth/pages/TailorRegister';

// 3. Public Marketing Feature Pages (sitting in features/public/pages/)
import HomePage from '../features/public/pages/HomePage';
// import AboutPage from '../features/public/pages/AboutPage';     // (Uncomment when files are added!)
// import ContactPage from '../features/public/pages/ContactPage'; // (Uncomment when files are added!)

// 4. Authenticated Role Feature Dashboard Pages
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'; // 👈 Matched with structure.txt!
import TailorDashboard from '../features/tailor/pages/TailorDashboard';   
// import TailorApprovals from '../features/admin/pages/TailorApprovals';   // (Uncomment when file is added!)

// 5. Authorization Guardians (Route Protection Bouncers)
import ProtectedRoute from './ProtectedRoute';

// 6. Tailor-Specific Feature Pages (Nested under TailorLayout for shared header/footer)
import UploadDesignPage from '../features/tailor/pages/UploadDesignPage';
import TailorProfilePage from '../features/tailor/pages/TailorProfilePage';
import StudioPortfolioPage from '../features/tailor/pages/StudioPortfolioPage';
import CustomerLayout from '../shared/layouts/CustomerLayout';

import CustomerProfile from '../features/customer/pages/CustomerProfile';
import CustomerMeasurements from '../features/customer/pages/CustomerMeasurements';
import ExploreTailors from '../features/customer/pages/ExploreTailors';
import NewStitchRequest from '../features/orders/pages/NewStitchRequest';
import CustomerDashboardList from '../features/orders/pages/CustomerDashboardList';

export default function AppRoutes() {
    return (
        <Routes>
            
            {/* 🟢 PUBLIC & CUSTOMER WORKSPACE PORTAL SHELL */}
            <Route element={<MainLayout />}>
                {/* Guest Accessible Pages */}
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/about" element={<AboutPage />} /> */}
                {/* <Route path="/contact" element={<ContactPage />} /> */}
                
                {/* Guest Authentication Action Portals */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register/customer" element={<RegisterPage />} />
                <Route path="/register/tailor" element={<TailorRegister />} />
                
                
                
                {/* 💡 CUSTOMER SUB-MODULE EXPANSIONS:
                    When building additional consumer screens, nest them here to retain the main header/footer:
                    <Route path="/custom-order" element={<ProtectedRoute allowedRoles={['customer']}><OrderDressPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><CustomerOrdersPage /></ProtectedRoute>} />
                */}
            </Route>

            <Route element={<CustomerLayout />}>
                <Route 
                    path="/customer/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    } 
                />
                    <Route path="/customer/measurements" element={<ProtectedRoute allowedRoles={['customer']}><CustomerMeasurements /></ProtectedRoute>} />
                    <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>} />
                    <Route path="/customer/new-stitch-request" element={<ProtectedRoute allowedRoles={['customer']}><NewStitchRequest /></ProtectedRoute>} />
                    <Route path="/customer/stitch-request-details" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboardList /></ProtectedRoute>} />
                    <Route path="/customer/explore-tailors" element={<ProtectedRoute allowedRoles={['customer']}><ExploreTailors /></ProtectedRoute>} />
            </Route>

            {/* 🔵 BUSINESS TAILOR WORKSPACE PORTAL SHELL */}
            <Route element={<TailorLayout />}>
                {/* Secured Tailor Vendor Workspace */}
                 <Route 
                    path="/tailor/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['tailor']}>
                            <TailorDashboard />
                        </ProtectedRoute>
                    } 
                />
                
                
                
                    <Route path="/tailor/upload" element={<ProtectedRoute allowedRoles={['tailor']}><UploadDesignPage /></ProtectedRoute>} />
                    <Route path="/tailor/profile" element={<ProtectedRoute allowedRoles={['tailor']}><TailorProfilePage /></ProtectedRoute>} />
                    <Route path="/tailor/portfolio" element={<ProtectedRoute allowedRoles={['tailor']}><StudioPortfolioPage /></ProtectedRoute>} />
                {/*    <Route path="/tailor/orders" element={<ProtectedRoute allowedRoles={['tailor']}><TailorOrdersPage /></ProtectedRoute>} />
                */}
    
            </Route>


            {/* 🔴 PLATFORM CONTROL COMMAND CENTER SHELL */}
            <Route element={<AdminLayout />}>
                {/* Secured Administrative Workspace Overview */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'staff']}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Secured Vendor Verification Dashboard Table */}
                {/*
                <Route 
                    path="/admin/tailors" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'staff']}>
                            <TailorApprovals />
                        </ProtectedRoute>
                    } 
                />
                */}
                
                {/* 💡 ADMINISTRATIVE SUB-MODULE EXPANSIONS:
                    Add global oversight metric logs or operational system configs below this line:
                    <Route path="/admin/customers" element={<ProtectedRoute allowedRoles={['admin']}><ManageCustomersPage /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><PlatformAnalytics /></ProtectedRoute>} />
                */}
            </Route>


            {/* 🟡 AUTOMATED CATCH-ALL PATTERN (Security Redirection Guard) */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
}