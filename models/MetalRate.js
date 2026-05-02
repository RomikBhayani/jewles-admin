const mongoose = require('mongoose');

const MetalRateSchema = new mongoose.Schema({
    metalType: { type: String, required: true, unique: true },
    ratePerGram: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('MetalRate', MetalRateSchema);
