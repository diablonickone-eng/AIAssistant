const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', scheduleController.getAll);
router.get('/today', scheduleController.getToday);
router.post('/', scheduleController.create);
router.put('/:id', scheduleController.update);
router.delete('/:id', scheduleController.remove);
router.patch('/:id/status', scheduleController.updateStatus);

module.exports = router;
