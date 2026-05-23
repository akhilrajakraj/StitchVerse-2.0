import { Outlet } from 'react-router-dom';
import CustomerHeader from '../../features/customer/components/CustomerHeader';
// 🌟 Notice we temporarily removed the Footer import until you build it!

export default function CustomerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* The Top Navigation Bar */}
            <CustomerHeader />

            {/* The Dashboard Content */}
            <main className="flex-grow">
                <Outlet />
            </main>
            
        </div>
    );
}