const Stats = require('../models/Stats');

class SocketService {
    constructor(io) {
        this.io = io;
        this.activeUsers = new Map(); // socket.id -> { lastSeen: timestamp }
        this.visitorsToday = new Set(); // Set of socket IDs that connected today
        this.setupListeners();
        this.startCleanupInterval();
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            console.log('🔌 Real-time tracker connected:', socket.id);

            // Handle joining internal rooms (Admin or Guest)
            socket.on('join-room', (roomId) => {
                socket.join(roomId);
                console.log(`🏠 Client ${socket.id} joined room: ${roomId}`);

                // If a guest joins, track them as active
                if (roomId === 'GUEST' || roomId.startsWith('guest_')) {
                    this.trackActivity(socket.id);
                    this.updateDailyVisitors(socket.id);
                } else if (roomId === 'ADMIN') {
                    this.emitMetrics(); // Sync metrics for newly joined admin
                }
            });

            // Heartbeat/Activity event from client
            socket.on('user-activity', () => {
                console.log(`💓 Heartbeat from ${socket.id}`);
                this.trackActivity(socket.id);
            });

            socket.on('disconnect', () => {
                this.activeUsers.delete(socket.id);
                this.emitMetrics();
            });
        });
    }

    trackActivity(socketId) {
        this.activeUsers.set(socketId, { lastSeen: Date.now() });
        this.emitMetrics();
    }

    async updateDailyVisitors(socketId) {
        const today = new Date().toISOString().split('T')[0];

        // Use a Set in memory for speed, but sync with DB occasionally
        if (!this.visitorsToday.has(socketId)) {
            this.visitorsToday.add(socketId);

            try {
                await Stats.findOneAndUpdate(
                    { date: today },
                    { $inc: { dailyVisitors: 1 } },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.error('Error updating stats:', err);
            }
        }
    }

    startCleanupInterval() {
        // Clean up inactive users every 1 minute
        setInterval(() => {
            const now = Date.now();
            const timeout = 5 * 60 * 1000; // 5 minutes

            let changed = false;
            for (const [id, data] of this.activeUsers.entries()) {
                if (now - data.lastSeen > timeout) {
                    this.activeUsers.delete(id);
                    changed = true;
                }
            }

            if (changed) {
                this.emitMetrics();
            }

            // Reset visitor set at midnight
            const currentHour = new Date().getHours();
            const currentMin = new Date().getMinutes();
            if (currentHour === 0 && currentMin === 0) {
                this.visitorsToday.clear();
            }
        }, 60000);
    }

    async emitMetrics() {
        const today = new Date().toISOString().split('T')[0];
        const stats = await Stats.findOne({ date: today });

        const metrics = {
            activeCustomers: this.activeUsers.size,
            totalVisitorsToday: stats?.dailyVisitors || 0,
        };

        // Emit only to admins
        this.io.to('ADMIN').emit('live-metrics', metrics);
    }
}

module.exports = SocketService;
