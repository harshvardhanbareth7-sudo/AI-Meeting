/**
 * Meetings Routes
 * GET    /api/meetings         → list all meetings
 * GET    /api/meetings/:id     → get single meeting
 * POST   /api/meetings         → create meeting (manual, without AI)
 * PUT    /api/meetings/:id     → update meeting
 * DELETE /api/meetings/:id     → delete meeting
 */

const express = require('express');
const router  = express.Router();
const { getAllMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting, getTasksByMeeting } = require('../services/dataStore');

router.get('/', (req, res) => {
  const meetings = getAllMeetings(req.query.userId);
  res.json({ meetings, total: meetings.length });
});

router.get('/:id', (req, res) => {
  const meeting = getMeetingById(req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  const tasks = getTasksByMeeting(meeting.id);
  res.json({ meeting, tasks });
});

router.post('/', (req, res) => {
  const { title, transcript, userId } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const meeting = createMeeting({ title, transcript, userId });
  res.status(201).json({ meeting });
});

router.put('/:id', (req, res) => {
  const updated = updateMeeting(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Meeting not found' });
  res.json({ meeting: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = deleteMeeting(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Meeting not found' });
  res.json({ message: 'Meeting deleted successfully' });
});

module.exports = router;
