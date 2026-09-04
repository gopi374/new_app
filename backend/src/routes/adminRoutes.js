const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.use(requireRole('MODERATOR'));

router.patch('/:collection/:id/verification', adminController.updateVerificationStatus);
router.patch('/:collection/:id/publication', adminController.updatePublicationStatus);

module.exports = router;
