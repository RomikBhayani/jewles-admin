const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    metal: { type: String, required: true },
    karat: { type: String, required: true },
    diamondType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ProductVariant', ProductVariantSchema);
