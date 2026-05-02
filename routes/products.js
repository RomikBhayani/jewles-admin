const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/create', productController.renderCreateForm);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductDetails);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
