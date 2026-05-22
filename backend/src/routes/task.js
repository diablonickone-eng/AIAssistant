const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', taskController.getAll);
router.get('/pending-summary', taskController.getPendingSummary);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);
router.patch('/:id/status', taskController.updateStatus);

module.exports = router;
