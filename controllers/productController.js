const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const MetalRate = require('../models/MetalRate');
const DiamondRate = require('../models/DiamondRate');
const Karat = require('../models/Karat');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order || 'desc';

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const sortQuery = {};
        sortQuery[sortBy] = order === 'asc' ? 1 : -1;

        const products = await Product.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort(sortQuery);

        const count = await Product.countDocuments(query);

        res.render('admin/products/index', {
            title: 'Products',
            products,
            currentPage: page,
            pages: Math.ceil(count / limit),
            search,
            sortBy,
            order
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.renderCreateForm = async (req, res) => {
    try {
        const metals = await MetalRate.find();
        const diamonds = await DiamondRate.find();
        const karats = await Karat.find();
        res.render('admin/products/create', {
            title: 'Add Product',
            metals,
            diamonds,
            karats: karats.map(k => k.name)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('/admin/products/create?error=Invalid product data');
    }
    try {
        const {
            name, description, category, sku, baseWeight, diamondCount,
            makingChargesPercent, availableMetals, availableKarats, availableDiamonds
        } = req.body;

        const product = await Product.create({
            name, description, category, sku,
            baseWeight: parseFloat(baseWeight),
            diamondCount: parseInt(diamondCount),
            makingChargesPercent: parseFloat(makingChargesPercent),
            availableMetals: Array.isArray(availableMetals) ? availableMetals : [availableMetals],
            availableKarats: Array.isArray(availableKarats) ? availableKarats : [availableKarats],
            availableDiamonds: Array.isArray(availableDiamonds) ? availableDiamonds : [availableDiamonds]
        });

        await generateVariants(product);

        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const variants = await ProductVariant.find({ product: product._id });

        const metalRates = await MetalRate.find();
        const diamondRates = await DiamondRate.find();
        const karats = await Karat.find();

        const metalRateMap = {};
        metalRates.forEach(r => metalRateMap[r.metalType] = r.ratePerGram);

        const diamondRateMap = {};
        diamondRates.forEach(r => diamondRateMap[r.diamondType] = r.ratePerPiece);

        const karatMap = {};
        karats.forEach(k => karatMap[k.name] = k.purity);

        const calculatedVariants = variants.map(v => {
            const metalRate = metalRateMap[v.metal] || 0;
            const diamondRate = diamondRateMap[v.diamondType] || 0;
            const purity = karatMap[v.karat] || 0;

            const metalCost = metalRate * product.baseWeight * purity;
            const diamondCost = diamondRate * product.diamondCount;
            const basePrice = metalCost + diamondCost;
            const finalPrice = basePrice + (basePrice * (product.makingChargesPercent / 100));

            return {
                ...v.toObject(),
                price: Math.round(finalPrice * 100) / 100
            };
        });

        res.render('admin/products/details', {
            title: product.name,
            product,
            variants: calculatedVariants
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.renderProductPreview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const variants = await ProductVariant.find({ product: product._id });

        const metalRates = await MetalRate.find();
        const diamondRates = await DiamondRate.find();
        const karats = await Karat.find();

        res.render('admin/products/preview', {
            title: `Preview: ${product.name}`,
            product,
            variants,
            metalRates,
            diamondRates,
            karats,
            layout: false // Render without the admin layout for a customer-facing look
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        await ProductVariant.deleteMany({ product: req.params.id });
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

async function generateVariants(product) {
    const variants = [];

    for (const metal of product.availableMetals) {
        for (const karat of product.availableKarats) {
            for (const diamondType of product.availableDiamonds) {
                variants.push({
                    product: product._id,
                    metal,
                    karat,
                    diamondType
                });
            }
        }
    }

    await ProductVariant.insertMany(variants);
}
