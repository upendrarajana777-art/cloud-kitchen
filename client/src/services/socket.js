import { io } from 'socket.io-client';

// Hardcoded Production Backend URL
const PROD_URL = 'https://cloud-kitchen-gf6y.onrender.com';

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
);

const SOCKET_URL = isLocalhost
    ? (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000')
    : PROD_URL;

console.log(`🔌 Socket connecting to: ${SOCKET_URL}`);

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
