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

let currentRoom = null;

// Handle re-connections automatically
socket.on('connect', () => {
    if (currentRoom) {
        console.log(`📡 Reconnected. Re-joining room: ${currentRoom}`);
        const token = currentRoom === 'ADMIN' ? localStorage.getItem('adminToken') : null;
        socket.emit('join-room', { roomId: currentRoom, token });
    }
});

export const connectSocket = (roomId) => {
    currentRoom = roomId;
    const token = roomId === 'ADMIN' ? localStorage.getItem('adminToken') : null;

    if (!socket.connected) {
        socket.connect();
    } else {
        // If already connected, just join the room with payload
        socket.emit('join-room', { roomId, token });
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
