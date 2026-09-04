const express = require('express');
const contributionController = require('../controllers/contributionController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, requireRole('CONTRIBUTOR'), contributionController.submitContribution);
router.get('/pending', authenticate, requireRole('MODERATOR'), contributionController.getPendingContributions);
router.post('/:id/approve', authenticate, requireRole('MODERATOR'), contributionController.approveContribution);

module.exports = router;
