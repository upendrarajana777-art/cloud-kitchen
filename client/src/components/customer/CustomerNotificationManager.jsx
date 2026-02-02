import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChefHat, Flame, MapPin, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerNotificationManager = () => {
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStatusToast = (event) => {
            const order = event.detail;
            const id = Date.now();

            const statusConfigs = {
                'pending': { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Order Confirmed' },
                'accepted': { icon: ChefHat, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Chef Accepted' },
                'preparing': { icon: Flame, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Now Cooking' },
                'ready': { icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Ready & Packed' },
                'out_for_delivery': { icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Out for Delivery' },
                'completed': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Delivered!' }
            };

            const config = statusConfigs[order.status] || statusConfigs['pending'];

            const newToast = {
                id,
                orderId: order._id,
                orderNumber: order._id.slice(-6).toUpperCase(),
                status: order.status,
                ...config
            };

            setToasts(prev => [newToast, ...prev]);

            // Auto remove after 6 seconds
            setTimeout(() => {
                removeToast(id);
            }, 6000);
        };

        window.addEventListener('order-status-toast', handleStatusToast);
        return () => window.removeEventListener('order-status-toast', handleStatusToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        onClick={() => {
                            navigate(`/my-orders?id=${toast.orderId}`);
                            removeToast(toast.id);
                        }}
                        className="pointer-events-auto cursor-pointer bg-white/90 backdrop-blur-xl rounded-[32px] p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform"
                    >
                        <div className={`h-12 w-12 ${toast.bg} rounded-2xl flex items-center justify-center ${toast.color} shrink-0`}>
                            <toast.icon size={24} />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-black text-slate-900 leading-tight text-sm">{toast.label}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Order #{toast.orderNumber}</p>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeToast(toast.id);
                            }}
                            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-300 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className={`absolute bottom-0 left-0 h-1 ${toast.bg.replace('bg-', 'bg-')}`}
                            style={{ backgroundColor: 'currentColor', opacity: 0.1 }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default CustomerNotificationManager;
