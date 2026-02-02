import { io } from 'socket.io-client';

// --- CONFIGURATION ---
const PROD_URL = 'https://cloud-kitchen-gf6y.onrender.com';

const getSocketUrl = () => {
    // 1. If we are on HTTPS, we are almost certainly in production
    if (window.location.protocol === 'https:') return PROD_URL;

    // 2. Check hostname for local development
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';

    if (isLocal) {
        return import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:5000';
    }

    // 3. Fallback to production for everything else
    return PROD_URL;
};

const SOCKET_URL = getSocketUrl();
console.log(`🔌 System: Connecting Socket to ${SOCKET_URL}`);

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['polling', 'websocket'], // Start with polling to establish connection, then upgrade
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
        socket.emit('join-room', userId);
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
