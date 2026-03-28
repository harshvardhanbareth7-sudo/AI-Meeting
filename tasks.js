/**
 * Tasks Routes
 * GET    /api/tasks            → list all tasks (filter by status, priority, assignee)
 * GET    /api/tasks/:id        → get single task
 * POST   /api/tasks            → create task manually
 * PATCH  /api/tasks/:id        → update task (status, deadline, etc.)
 * DELETE /api/tasks/:id        → delete task
 */

const express = require('express');
const router  = express.Router();
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../services/dataStore');

router.get('/', (req, res) => {
  let tasks = getAllTasks(req.query.userId);

  // Optional filters
  if (req.query.status)   tasks = tasks.filter(t => t.status === req.query.status);
  if (req.query.priority) tasks = tasks.filter(t => t.priority === req.query.priority);
  if (req.query.assignee) tasks = tasks.filter(t => t.assignee.toLowerCase().includes(req.query.assignee.toLowerCase()));

  // Stats
  const stats = {
    total:      tasks.length,
    pending:    tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done:       tasks.filter(t => t.status === 'done').length,
    overdue:    tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length,
  };

  res.json({ tasks, stats });
});

router.get('/:id', (req, res) => {
  const task = getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = createTask(req.body);
  res.status(201).json({ task });
});

router.patch('/:id', (req, res) => {
  const task = getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  // Validate status transitions
  const validStatuses = ['pending', 'in-progress', 'done', 'blocked'];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updated = updateTask(req.params.id, req.body);
  res.json({ task: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
