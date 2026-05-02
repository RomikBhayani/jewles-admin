const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateController = require('../controllers/rateController');

router.get('/', rateController.getAllRates);
router.post('/metal', [
    body('metalType').notEmpty().trim().escape(),
    body('ratePerGram').isFloat({ min: 0 })
], rateController.addMetalRate);
router.delete('/metal/:id', rateController.deleteMetalRate);
router.post('/diamond', [
    body('diamondType').notEmpty().trim().escape(),
    body('ratePerPiece').isFloat({ min: 0 })
], rateController.addDiamondRate);
router.delete('/diamond/:id', rateController.deleteDiamondRate);
router.post('/karat', [
    body('name').notEmpty().trim().escape(),
    body('purity').isFloat({ min: 0, max: 1 })
], rateController.addKarat);
router.delete('/karat/:id', rateController.deleteKarat);

module.exports = router;
