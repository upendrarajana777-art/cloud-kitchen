import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : (import.meta.env.PROD
        ? 'https://cloud-kitchen-gf6y.onrender.com'
        : 'http://localhost:5000');

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
