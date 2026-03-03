import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/authService';
import { useUIStore } from '../../store/uiStore';

export default function Navbar() {
    const { user, clearUser } = useAuthStore();
    const { theme, toggleTheme } = useUIStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser();
            navigate('/login');
        }
    };

    return (
        <nav className={`shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Task Manager Pro
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-2xl" title="Cambiar tema">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {user?.displayName || user?.email}
                        </span>
                        <button onClick={handleLogout} className="btn-secondary">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}