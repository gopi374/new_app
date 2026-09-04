const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');

router.get('/summary', optionalAuthenticate, passportController.getPassportSummary);
router.post('/visit', authenticate, passportController.logVisit);
router.post('/toggle-visit', authenticate, passportController.toggleVisit);

module.exports = router;
