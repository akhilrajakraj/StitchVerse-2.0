import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <main className="flex-grow">
                    <Outlet /> 
                </main>
            </div>
            <Footer />
        </>
    );
}