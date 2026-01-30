import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ChefHat, PhoneCall, Shield, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { cn } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { getKitchenStatus } from '../../lib/db';
import socket from '../../services/socket';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [kitchenOpen, setKitchenOpen] = useState(true);
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        getKitchenStatus().then(status => setKitchenOpen(status.isOpen));

        socket.on('kitchen-status-changed', (status) => setKitchenOpen(status));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            socket.off('kitchen-status-changed');
        };
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            scrolled ? "py-4 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]" : "py-8 bg-transparent"
        )}>
            <div className="container mx-auto px-6 md:px-12">
                {/* Desktop and Tablet Layout */}
                <div className="hidden sm:flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                            <img src="/logo.png" alt="CloudKitchen Logo" className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <span className="block text-xl font-black text-slate-900 tracking-tighter leading-none">CLOUD<span className="text-orange-500">KITCHEN.</span></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Premium Taste</span>
                        </div>
                    </Link>

                    {/* Mobile Status Badge - Shows in top navbar on mobile/tablet */}
                    <div className="lg:hidden">
                        <StatusBadge isOpen={kitchenOpen} />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-12">
                        <StatusBadge isOpen={kitchenOpen} />

                        <div className="flex items-center gap-8">
                            {['Menu', 'My Orders'].map(item => (
                                <Link
                                    key={item}
                                    to={item === 'Menu' ? '/' : '/my-orders'}
                                    className={cn(
                                        "text-sm font-black uppercase tracking-widest transition-colors",
                                        location.pathname === (item === 'Menu' ? '/' : '/my-orders')
                                            ? "text-orange-500"
                                            : "text-slate-400 hover:text-slate-900"
                                    )}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative group">
                                <Button variant="ghost" size="icon" className="relative h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:border-orange-200">
                                    <ShoppingBag size={24} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-6 w-6 bg-grad-primary text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-white shadow-lg">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link to="/admin/login">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group border-0"
                                >
                                    <Shield size={20} className="text-white group-hover:scale-110 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/support">
                                <Button variant="secondary" size="md" className="hidden xl:flex">
                                    <PhoneCall size={18} className="mr-2" /> Support
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex lg:hidden items-center gap-4">
                        <Link to="/cart" className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                <ShoppingBag size={22} className="text-slate-700" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-[8px] font-black flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Small Mobile Layout - Stacked */}
                <div className="flex sm:hidden flex-col gap-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                <img src="/logo.png" alt="CloudKitchen Logo" className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <span className="block text-lg font-black text-slate-900 tracking-tighter leading-none">CLOUD<span className="text-orange-500">KITCHEN.</span></span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Premium Taste</span>
                            </div>
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center gap-3">
                            <Link to="/cart" className="relative">
                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                    <ShoppingBag size={20} className="text-slate-700" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-[8px] font-black flex items-center justify-center rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Status Badge - Full width on small mobile */}
                    <div className="flex justify-center">
                        <StatusBadge isOpen={kitchenOpen} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 shadow-2xl animate-in slide-in-from-top-5 duration-500">
                    <div className="flex flex-col gap-4">
                        {/* Main Navigation Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 border-2 border-orange-200 rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Utensils size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">The Menu</h3>
                                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1">Browse Dishes</p>
                                    </div>
                                </div>
                                {/* Decorative element */}
                                <div className="absolute -top-6 -right-6 h-20 w-20 bg-orange-200/30 rounded-full blur-2xl group-hover:bg-orange-300/40 transition-colors" />
                            </Link>

                            <Link
                                to="/my-orders"
                                onClick={() => setIsOpen(false)}
                                className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 border-2 border-blue-200 rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <ChefHat size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Track Order</h3>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">Live Status</p>
                                    </div>
                                </div>
                                {/* Decorative element */}
                                <div className="absolute -top-6 -right-6 h-20 w-20 bg-blue-200/30 rounded-full blur-2xl group-hover:bg-blue-300/40 transition-colors" />
                            </Link>
                        </div>

                        <div className="h-px bg-slate-100 w-full my-2" />

                        {/* Admin and Support Buttons */}
                        <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-orange-500 hover:to-orange-600 shadow-lg">
                                <Shield size={20} className="mr-2" /> Admin Portal
                            </Button>
                        </Link>
                        <Button variant="primary" size="lg" className="w-full">
                            <PhoneCall size={20} className="mr-2" /> Call Kitchen
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
