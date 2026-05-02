const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

router.get('/', themeController.getThemeSettings);
router.post('/', themeController.updateThemeSettings);

module.exports = router;
