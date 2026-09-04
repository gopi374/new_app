const express = require('express');
const reportController = require('../controllers/reportController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, reportController.submitReport);
router.get('/open', authenticate, requireRole('MODERATOR'), reportController.getOpenReports);
router.patch('/:id/resolve', authenticate, requireRole('MODERATOR'), reportController.resolveReport);

module.exports = router;
