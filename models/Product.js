const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    images: [{ type: String }],
    sku: { type: String, unique: true },
    baseWeight: { type: Number, required: true }, // in grams
    diamondCount: { type: Number, default: 0 },
    makingChargesPercent: { type: Number, default: 10 },

    // Configurable options for variants
    availableMetals: [{ type: String }],
    availableKarats: [{ type: String }],
    availableDiamonds: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
