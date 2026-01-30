import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import NotificationManager from '../components/admin/NotificationManager';

import { connectSocket } from '../services/socket';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        // Join admin room for live metrics and alerts
        console.log('🛡️ Admin Layout: Joining ADMIN room');
        connectSocket('ADMIN');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const links = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
        { name: 'Food Items', path: '/admin/food', icon: UtensilsCrossed },
        { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <NotificationManager />
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 z-50 hidden md:flex flex-col shadow-2xl shadow-gray-200/50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                            <img src="/logo.png" alt="Admin Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900">ADMIN <span className="text-primary">HUB.</span></span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-[20px] text-sm font-black transition-all duration-300 uppercase tracking-widest",
                                location.pathname === link.path
                                    ? "bg-primary text-white shadow-xl shadow-primary/30 translate-x-2"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <link.icon size={18} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50 space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-sm font-black text-red-500 bg-red-50 hover:bg-red-100 transition-all uppercase tracking-widest"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <Link
                        to="/"
                        className="flex items-center gap-4 px-6 py-3 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft size={14} /> Back to Site
                    </Link>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 md:ml-72 p-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
