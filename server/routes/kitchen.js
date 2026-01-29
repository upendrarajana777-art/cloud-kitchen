const express = require('express');
const router = express.Router();
const KitchenStatus = require('../models/KitchenStatus');

// GET kitchen status
router.get('/status', async (req, res) => {
    try {
        let status = await KitchenStatus.findOne();
        if (!status) {
            status = await KitchenStatus.create({ isOpen: true });
        }
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update kitchen status (Now Public)
router.put('/status', async (req, res) => {
    try {
        const { isOpen } = req.body;
        let status = await KitchenStatus.findOne();
        if (!status) {
            status = new KitchenStatus({ isOpen });
        } else {
            status.isOpen = isOpen;
        }
        await status.save();

        // Notify all clients about the change
        req.io.emit('kitchen-status-changed', isOpen);

        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
