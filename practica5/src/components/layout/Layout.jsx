import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
            <Navbar />
            <Toaster position="bottom-right" />
            <main>
                <Outlet />
            </main>
        </div>
    );
}