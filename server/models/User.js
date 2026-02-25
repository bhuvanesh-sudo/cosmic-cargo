const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: 'Commander' },
        energyCells: { type: Number, default: 0 },
        level: { type: Number, default: 1, min: 1, max: 3 },
        gamesPlayed: { type: Number, default: 0 },
        lastSeen: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Auto-level up based on energyCells
userSchema.methods.recalculateLevel = function () {
    if (this.energyCells >= 100) this.level = 3;
    else if (this.energyCells >= 40) this.level = 2;
    else this.level = 1;
};

module.exports = mongoose.model('User', userSchema);
