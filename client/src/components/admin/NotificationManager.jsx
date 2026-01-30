import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Volume2, VolumeX, X, ShoppingBag } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import Button from '../ui/Button';

const NotificationManager = () => {
    const { settings, setSettings, clearAlerts, newOrders, requestNotificationPermission } = useAlerts();
    const [toasts, setToasts] = useState([]);
    const [audioBlocked, setAudioBlocked] = useState(false);

    useEffect(() => {
        // Request permission on mount
        requestNotificationPermission();

        // Listen for internal toast events
        const handleToast = (event) => {
            const order = event.detail;
            const id = Date.now();

            const newToast = {
                id,
                orderNumber: order._id.slice(-6).toUpperCase(),
                amount: order.totalAmount,
                itemsCount: order.items.length
            };

            setToasts(prev => [newToast, ...prev]);

            // Auto remove after 10 seconds
            setTimeout(() => {
                removeToast(id);
            }, 10000);
        };

        const handleAudioBlocked = () => setAudioBlocked(true);
        const handleAudioUnlocked = () => setAudioBlocked(false);

        window.addEventListener('new-order-toast', handleToast);
        window.addEventListener('audio-blocked-alert', handleAudioBlocked);
        window.addEventListener('click', handleAudioUnlocked);

        return () => {
            window.removeEventListener('new-order-toast', handleToast);
            window.removeEventListener('audio-blocked-alert', handleAudioBlocked);
            window.removeEventListener('click', handleAudioUnlocked);
        };
    }, [requestNotificationPermission]);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const hasNewOrders = newOrders.length > 0;

    return (
        <>
            {/* Real-time Order Toasts */}
            <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="pointer-events-auto bg-white rounded-[32px] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-orange-100 flex items-center gap-4 relative overflow-hidden group"
                        >
                            {/* Accent line */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500" />

                            <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                                <ShoppingBag size={28} />
                            </div>

                            <div className="flex-1">
                                <h4 className="font-black text-slate-900 leading-tight">New Order Received!</h4>
                                <p className="text-sm font-bold text-slate-500">Order #{toast.orderNumber}</p>
                                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mt-1">₹{toast.amount} • {toast.itemsCount} Items</p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            {/* Progress bar */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-1 bg-orange-100"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Sticky Order Alert Control (Visible when sound is playing) */}
            <AnimatePresence>
                {hasNewOrders && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6"
                    >
                        <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl flex items-center justify-between gap-6 border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center animate-bounce">
                                    <Bell size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-black text-lg leading-tight">{newOrders.length} New Orders!</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alert sound active</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-white text-slate-900 hover:bg-slate-100"
                                    onClick={clearAlerts}
                                >
                                    Stop Sound
                                </Button>
                            </div>
                        </div>

                        {/* Audio Blocked Warning */}
                        {audioBlocked && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 bg-red-500 text-white px-6 py-3 rounded-2xl text-xs font-bold text-center animate-pulse"
                            >
                                🔇 Sound is blocked by your browser. Click anywhere on the dashboard to enable alerts!
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Toggle in Sidebar context or Floating (optional placement) */}
            {/* For this implementation, we can expose a settings UI or just handle it in the AdminLayout/Settings page */}
        </>
    );
};

export default NotificationManager;
