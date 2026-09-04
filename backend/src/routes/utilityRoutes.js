const express = require('express');
const router = express.Router();
const utilityController = require('../controllers/utilityController');

router.get('/weather', utilityController.getWeather);
router.get('/government-services', utilityController.getGovernmentUtilities);

module.exports = router;
