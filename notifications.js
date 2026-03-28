const express = require('express');
const router  = express.Router();
const { getNotifications, createNotification, markNotificationRead } = require('../services/dataStore');

router.get('/', (req, res) => {
  const notifs = getNotifications(req.query.userId);
  res.json({ notifications: notifs, unread: notifs.filter(n => !n.read).length });
});

router.post('/', (req, res) => {
  const { title, message, type, userId, taskId } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message required.' });
  const notif = createNotification({ title, message, type, userId, taskId });
  res.status(201).json({ notification: notif });
});

router.patch('/:id/read', (req, res) => {
  const notif = markNotificationRead(req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification not found.' });
  res.json({ notification: notif });
});

module.exports = router;
