const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    total: { type: Number, required: true },
    address: mongoose.Schema.Types.Mixed,
    location: {
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled']
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid', 'failed']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
