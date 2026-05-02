const mongoose = require('mongoose');

const DiamondRateSchema = new mongoose.Schema({
    diamondType: { type: String, required: true, unique: true },
    ratePerPiece: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DiamondRate', DiamondRateSchema);
