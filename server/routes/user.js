const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/user — create or retrieve session user
router.post('/', async (req, res) => {
    try {
        const { name = 'Commander' } = req.body;
        const user = await User.create({ name });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/user/:id — get user progress
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.lastSeen = Date.now();
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/user/:id/score — award Energy Cells and update level
router.patch('/:id/score', async (req, res) => {
    try {
        const { award = 5 } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.energyCells += award;
        user.gamesPlayed += 1;
        user.recalculateLevel();
        user.lastSeen = Date.now();
        await user.save();

        res.json({
            energyCells: user.energyCells,
            level: user.level,
            gamesPlayed: user.gamesPlayed,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
