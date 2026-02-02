import { io } from 'socket.io-client';

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : (isLocalhost ? 'http://localhost:5000' : 'https://cloud-kitchen-gf6y.onrender.com');

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
