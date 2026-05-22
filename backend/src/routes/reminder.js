const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', reminderController.getAll);
router.post('/', reminderController.create);
router.delete('/:id', reminderController.remove);

module.exports = router;
