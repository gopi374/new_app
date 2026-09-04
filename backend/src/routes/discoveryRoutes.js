const express = require('express');
const discoveryController = require('../controllers/discoveryController');
const { optionalAuthenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/near', optionalAuthenticate, discoveryController.getNear);
router.get('/discovery/near', optionalAuthenticate, discoveryController.getNear);
router.get('/discovery/bbox', optionalAuthenticate, discoveryController.getBBox);
router.get('/search', optionalAuthenticate, discoveryController.search);

module.exports = router;
