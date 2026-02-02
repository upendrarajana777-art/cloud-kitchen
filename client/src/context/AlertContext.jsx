import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import socket from '../services/socket';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('admin_alert_settings');
        return saved ? JSON.parse(saved) : { sound: true, notifications: true };
    });

    const [newOrders, setNewOrders] = useState([]);
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const audioRef = useRef(null);

    // Defensive check to ensure sound only plays for admins
    const isAdmin = useCallback(() => {
        return localStorage.getItem('adminToken') === 'cloud-kitchen-admin-secure-session';
    }, []);


    // Initialize audio and unlock mechanism
    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3');
        audioRef.current.loop = true;

        const unlockAudio = () => {
            if (audioRef.current && !audioUnlocked) {
                audioRef.current.play()
                    .then(() => {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                        setAudioUnlocked(true);
                        console.log('✅ Audio context shared & unlocked');
                        window.removeEventListener('click', unlockAudio);
                        window.removeEventListener('touchstart', unlockAudio);
                    })
                    .catch(e => console.log('Waiting for interaction to unlock shared audio...'));
            }
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []); // Run only once on mount

    const stopSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            // Sync with other tabs
            localStorage.setItem('admin_stop_all_sounds', Date.now().toString());
        }
    }, []);

    // Listen for stops from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'admin_stop_all_sounds') {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                setNewOrders([]);
            }
            if (e.key === 'admin_mark_as_seen') {
                const orderId = e.newValue;
                setNewOrders(prev => {
                    const updated = prev.filter(id => id !== orderId);
                    if (updated.length === 0 && audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }
                    return updated;
                });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const playSound = useCallback(() => {
        if (!audioRef.current) return;

        // Only play if: 
        // 1. Sound is enabled in settings
        // 2. User is actually an admin (defensive check)
        if (settings.sound && isAdmin()) {
            console.log('🔊 Playing admin alert sound...');
            audioRef.current.play().catch(error => {
                if (error.name === 'NotAllowedError') {
                    window.dispatchEvent(new CustomEvent('audio-blocked-alert'));
                }
            });
        }
    }, [settings.sound]);

    // Save settings
    useEffect(() => {
        localStorage.setItem('admin_alert_settings', JSON.stringify(settings));
    }, [settings]);

    // Stop sound if disabled in settings
    useEffect(() => {
        if (!settings.sound) {
            stopSound();
        }
    }, [settings.sound, stopSound]);

    const showBrowserNotification = useCallback((order) => {
        if (!settings.notifications || !("Notification" in window) || !isAdmin()) return;

        if (Notification.permission === "granted") {
            const notification = new Notification("🔔 New Order Received!", {
                body: `Order #${order._id.slice(-6).toUpperCase()} - ₹${order.totalAmount}`,
                icon: '/logo.png',
                tag: 'new-order',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }, [settings.notifications]);

    const requestNotificationPermission = useCallback(async () => {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    }, []);

    const clearAlerts = useCallback(() => {
        stopSound();
        setNewOrders([]);
    }, [stopSound]);

    const markAsSeen = useCallback((orderId) => {
        // Sync with central list
        setNewOrders(prev => {
            const updated = prev.filter(id => id !== orderId);
            if (updated.length === 0) stopSound();
            return updated;
        });
        // Sync with other tabs
        localStorage.setItem('admin_mark_as_seen', orderId);
        // Clear immediately so it can be set again for same order if needed
        setTimeout(() => localStorage.removeItem('admin_mark_as_seen'), 100);
    }, [stopSound]);

    useEffect(() => {
        const handleNewOrder = (order) => {
            console.log('⚡ Shared socket event received:', order._id);
            setNewOrders(prev => {
                if (prev.includes(order._id)) {
                    console.log('⏭️ Order already in list, skipping side-effects.');
                    return prev;
                }
                console.log('🔔 Triggering alerts for new order!');
                return [...prev, order._id];
            });
            playSound();
            showBrowserNotification(order);
            window.dispatchEvent(new CustomEvent('new-order-toast', { detail: order }));
        };

        const handleStatusUpdate = (order) => {
            console.log('📈 Order status updated:', order._id, order.status);
            window.dispatchEvent(new CustomEvent('order-status-toast', { detail: order }));
        };

        console.log('📡 AlertContext: Registering socket listeners');
        socket.on('new-order', handleNewOrder);
        socket.on('order-status-updated', handleStatusUpdate);

        return () => {
            console.log('📡 AlertContext: Removing socket listeners');
            socket.off('new-order', handleNewOrder);
            socket.off('order-status-updated', handleStatusUpdate);
        };
    }, [playSound, showBrowserNotification]);

    const value = {
        settings,
        setSettings,
        newOrders,
        audioUnlocked,
        clearAlerts,
        markAsSeen,
        requestNotificationPermission,
        stopSound,
        playSound
    };

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlerts must be used within an AlertProvider');
    return context;
};
