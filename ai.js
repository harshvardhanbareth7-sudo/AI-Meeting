/**
 * AI Routes
 * POST /api/ai/extract   → extract tasks from meeting input
 * POST /api/ai/chat      → chat with AI assistant
 * POST /api/ai/suggest   → get proactive suggestions for tasks
 */

const express = require('express');
const router  = express.Router();
const { extractActionsFromTranscript, chatWithAI, generateTaskSuggestions } = require('../services/aiService');
const { createMeeting, createTask, createNotification, getAllTasks } = require('../services/dataStore');

// POST /api/ai/extract
router.post('/extract', async (req, res) => {
  try {
    const { transcript, title, source, userId } = req.body;

    if (!transcript || transcript.trim().length < 20) {
      return res.status(400).json({ error: 'Transcript must be at least 20 characters.' });
    }

    const result = await extractActionsFromTranscript(transcript, title);

    // Persist meeting
    const meeting = createMeeting({
      title:          title || 'Meeting ' + new Date().toLocaleDateString(),
      transcript,
      summary:        result.summary,
      keyDecisions:   result.keyDecisions,
      topicsDiscussed:result.topicsDiscussed,
      sentiment:      result.sentiment,
      followUpDate:   result.followUpDate,
      stakeholders:   result.stakeholders,
      source:         source || 'text',
      userId:         userId || 'demo',
    });

    // Persist tasks linked to meeting
    const savedTasks = result.tasks.map(t =>
      createTask({ ...t, meetingId: meeting.id, userId: userId || 'demo' })
    );

    // Auto-create notifications for high-priority tasks
    savedTasks
      .filter(t => t.priority === 'high')
      .forEach(t => {
        createNotification({
          userId: userId || 'demo',
          type: 'risk',
          title: '🔴 High-priority task created',
          message: `"${t.title}" assigned to ${t.assignee}`,
          taskId: t.id,
        });
      });

    res.json({ meeting, tasks: savedTasks, aiResult: result });
  } catch (err) {
    console.error('AI extract error:', err);
    res.status(500).json({ error: 'AI extraction failed: ' + err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const tasks    = getAllTasks(userId);
    const contextData = {
      taskCount:    tasks.filter(t => t.status === 'pending').length,
      meetingCount: 0,
      userName:     req.body.userName || 'User',
    };

    const reply = await chatWithAI(message, history || [], contextData);
    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI chat failed: ' + err.message });
  }
});

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  try {
    const { userId } = req.body;
    const tasks = getAllTasks(userId);
    const suggestions = await generateTaskSuggestions(tasks.slice(0, 10));
    res.json({ suggestions });
  } catch (err) {
    console.error('AI suggest error:', err);
    res.status(500).json({ error: 'Suggestion failed: ' + err.message });
  }
});

module.exports = router;
