const taskService = require('../services/taskService');

/**
 * Get tasks visible to current user (normal: own tasks, admin: all tasks).
 * GET /api/tasks
 */
const getTasks = (req, res) => {
  const { status } = req.query;
  const tasks = taskService.getTasks({
    user: req.user,
    status: status ? status.toLowerCase() : null
  });
  return res.status(200).json(tasks);
};

/**
 * Create a new task.
 * POST /api/tasks
 */
const createTask = (req, res) => {
  const { title, description } = req.body;
  const task = taskService.createTask({
    user: req.user,
    title,
    description
  });
  return res.status(201).json(task);
};

/**
 * Update task by ID.
 * PATCH /api/tasks/:id
 */
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const result = taskService.updateTask({
    user: req.user,
    taskId: id,
    updates: { title, description, status }
  });

  if (result.notFound) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.status(200).json(result.task);
};

/**
 * Delete task by ID.
 * DELETE /api/tasks/:id
 */
const deleteTask = (req, res) => {
  const { id } = req.params;

  const result = taskService.deleteTask({
    user: req.user,
    taskId: id
  });

  if (result.notFound) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.status(204).send();
};

/**
 * Get aggregate statistics for accessible tasks.
 * GET /api/tasks/stats
 */
const getStats = (req, res) => {
  const stats = taskService.getStats({ user: req.user });
  return res.status(200).json(stats);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getStats
};

