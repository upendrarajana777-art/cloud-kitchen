const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/food', require('./routes/food'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/kitchen', require('./routes/kitchen'));

// Socket.io Service
const SocketService = require('./services/SocketService');
new SocketService(io);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Cloud Kitchen API – Production Ready' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error("🔥 Global Error Handler:");
    console.error(err); // Log full error
    if (err.stack) console.error(err.stack);

    // Cloudinary specific error handling
    if (err.http_code) {
        return res.status(err.http_code).json({ error: err.message, details: err });
    }

    res.status(500).json({
        error: err.message || 'Unknown Server Error',
        details: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
