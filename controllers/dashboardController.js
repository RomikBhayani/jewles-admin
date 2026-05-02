const Product = require('../models/Product');
const MetalRate = require('../models/MetalRate');
const DiamondRate = require('../models/DiamondRate');

exports.getDashboardStats = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const metalCount = await MetalRate.countDocuments();
        const diamondCount = await DiamondRate.countDocuments();

        res.render('index', {
            title: 'Dashboard',
            productCount,
            metalCount,
            diamondCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
