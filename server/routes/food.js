const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { upload } = require('../utils/cloudinary');

// Get all food items or by category
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category && category !== 'All Items' ? { category } : {};
        const items = await Food.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single food item
router.get('/:id', async (req, res) => {
    try {
        const item = await Food.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create food item (with image upload)
router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.warn("⚠️ Image Upload Failed (using placeholder):", err.message);
            // Proceed without file. req.file will be undefined.
            return next();
        }
        next();
    });
}, async (req, res) => {
    try {
        const foodData = { ...req.body };
        if (req.file) {
            foodData.imageUrl = req.file.path; // Cloudinary URL
        } else if (!foodData.imageUrl) {
            // Default placeholder if upload failed and no URL provided
            foodData.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
        }
        const item = await Food.create(foodData);
        // Real-time broadcast
        req.io.emit('food-added', item);
        res.status(201).json(item);
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update food item
router.put('/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.warn("⚠️ Image Upload Failed (using existing/placeholder):", err.message);
            return next();
        }
        next();
    });
}, async (req, res) => {
    try {
        const foodData = { ...req.body };
        if (req.file) {
            foodData.imageUrl = req.file.path;
        }
        // If upload failed, we just keep the old image (or whatever was passed)

        const item = await Food.findByIdAndUpdate(
            req.params.id,
            foodData,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        // Real-time broadcast
        req.io.emit('food-updated', item);
        res.json(item);
    } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ error: error.message });
    }
});

// Delete food item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Food.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        // Real-time broadcast
        req.io.emit('food-deleted', req.params.id);
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
