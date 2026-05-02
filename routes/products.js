const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/create', productController.renderCreateForm);
router.post('/', [
    body('name').notEmpty().trim().escape(),
    body('sku').notEmpty().trim().escape(),
    body('baseWeight').isFloat({ min: 0 }),
    body('diamondCount').isInt({ min: 0 }),
    body('makingChargesPercent').isFloat({ min: 0 })
], productController.createProduct);
router.get('/:id', productController.getProductDetails);
router.get('/:id/preview', productController.renderProductPreview);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
