const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateCreateTask, validateUpdateTask } = require('../validators/taskValidator');

// All task routes require an authenticated session
router.use(requireAuth);

router.get('/stats', taskController.getStats);
router.get('/', taskController.getTasks);
router.post('/', validateCreateTask, taskController.createTask);
router.patch('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

