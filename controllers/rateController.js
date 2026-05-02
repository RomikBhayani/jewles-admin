const MetalRate = require('../models/MetalRate');
const DiamondRate = require('../models/DiamondRate');
const Karat = require('../models/Karat');

exports.getAllRates = async (req, res) => {
    try {
        const metalRates = await MetalRate.find();
        const diamondRates = await DiamondRate.find();
        const karats = await Karat.find();
        res.render('admin/rates/index', {
            title: 'Rate Management',
            metalRates,
            diamondRates,
            karats,
            predefinedMetals: ['Gold', 'Silver', 'Platinum', 'Rose Gold'],
            predefinedDiamonds: ['Real Diamond', 'Lab Grown', 'Moissanite']
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addKarat = async (req, res) => {
    try {
        const { name, purity } = req.body;
        await Karat.findOneAndUpdate(
            { name },
            { purity: parseFloat(purity) },
            { upsert: true, new: true }
        );
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteKarat = async (req, res) => {
    try {
        await Karat.findByIdAndDelete(req.params.id);
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addMetalRate = async (req, res) => {
    try {
        const { metalType, ratePerGram } = req.body;
        await MetalRate.findOneAndUpdate(
            { metalType },
            { ratePerGram },
            { upsert: true, new: true }
        );
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteMetalRate = async (req, res) => {
    try {
        await MetalRate.findByIdAndDelete(req.params.id);
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addDiamondRate = async (req, res) => {
    try {
        const { diamondType, ratePerPiece } = req.body;
        await DiamondRate.findOneAndUpdate(
            { diamondType },
            { ratePerPiece },
            { upsert: true, new: true }
        );
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteDiamondRate = async (req, res) => {
    try {
        await DiamondRate.findByIdAndDelete(req.params.id);
        res.redirect('/admin/rates');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
