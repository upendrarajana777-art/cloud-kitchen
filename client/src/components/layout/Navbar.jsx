import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ChefHat, PhoneCall } from 'lucide-react';
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
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
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

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-12">
                    <StatusBadge isOpen={kitchenOpen} />

                    <div className="flex items-center gap-8">
                        {['Menu', 'Orders'].map(item => (
                            <Link
                                key={item}
                                to={item === 'Menu' ? '/' : `/${item.toLowerCase()}`}
                                className={cn(
                                    "text-sm font-black uppercase tracking-widest transition-colors",
                                    location.pathname === (item === 'Menu' ? '/' : `/${item.toLowerCase()}`)
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

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 shadow-2xl animate-in slide-in-from-top-5 duration-500">
                    <div className="flex flex-col gap-6">
                        <StatusBadge isOpen={kitchenOpen} className="self-start" />
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-black text-slate-900">The Menu</Link>
                        <Link to="/orders" onClick={() => setIsOpen(false)} className="text-2xl font-black text-slate-900">Track Order</Link>
                        <div className="h-px bg-slate-100 w-full" />
                        <Button variant="primary" size="lg" className="w-full">
                            Call Kitchen
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
