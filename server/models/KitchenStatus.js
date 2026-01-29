const mongoose = require('mongoose');

const kitchenStatusSchema = new mongoose.Schema({
    isOpen: { type: Boolean, default: true },
    updatedBy: String
}, { timestamps: true });

module.exports = mongoose.model('KitchenStatus', kitchenStatusSchema);
