const express = require('express');
const savedItemsController = require('../controllers/savedItemsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', savedItemsController.getSavedItems);
router.post('/', savedItemsController.addSavedItem);
router.delete('/:id', savedItemsController.removeSavedItem);

module.exports = router;
