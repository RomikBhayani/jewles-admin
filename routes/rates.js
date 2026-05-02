const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');

router.get('/', rateController.getAllRates);
router.post('/metal', rateController.addMetalRate);
router.delete('/metal/:id', rateController.deleteMetalRate);
router.post('/diamond', rateController.addDiamondRate);
router.delete('/diamond/:id', rateController.deleteDiamondRate);
router.post('/karat', rateController.addKarat);
router.delete('/karat/:id', rateController.deleteKarat);

module.exports = router;
