const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

router.get('/featured', reelController.getFeaturedReels);

module.exports = router;
