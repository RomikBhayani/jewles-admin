const mongoose = require('mongoose');

const KaratSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., '18K'
    purity: { type: Number, required: true }, // e.g., 0.75
}, { timestamps: true });

module.exports = mongoose.model('Karat', KaratSchema);
