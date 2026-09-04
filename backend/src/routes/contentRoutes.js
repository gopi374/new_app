const express = require('express');
const contentController = require('../controllers/contentController');
const { optionalAuthenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:collection', optionalAuthenticate, contentController.listItems);
router.get('/:collection/:id', optionalAuthenticate, contentController.getItemById);

module.exports = router;
