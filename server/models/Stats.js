const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        unique: true
    },
    dailyVisitors: {
        type: Number,
        default: 0
    },
    totalOrdersToday: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Stats', StatsSchema);
