/**
 * AI Service
 * Handles meeting transcript analysis, action item extraction,
 * stakeholder detection, and deadline parsing using the Claude API.
 */

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// extractActionsFromTranscript
// Returns structured JSON with summary, tasks, deadlines, stakeholders
// ─────────────────────────────────────────────────────────────────────────────
async function extractActionsFromTranscript(transcript, meetingTitle = 'Untitled Meeting') {
  const prompt = `You are an expert meeting analyst. Analyze the following meeting transcript and extract ALL actionable information.

Meeting Title: ${meetingTitle}

Transcript:
"""
${transcript}
"""

Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "summary": "2-3 sentence executive summary of the meeting",
  "keyDecisions": ["decision 1", "decision 2"],
  "tasks": [
    {
      "id": "task_1",
      "title": "Short task title",
      "description": "Detailed description of what needs to be done",
      "assignee": "Person name or 'Unassigned'",
      "deadline": "YYYY-MM-DD or null if not specified",
      "priority": "high | medium | low",
      "status": "pending",
      "tags": ["tag1", "tag2"]
    }
  ],
  "stakeholders": [
    {
      "name": "Person name",
      "role": "Their role or department",
      "tasksCount": 0
    }
  ],
  "followUpDate": "YYYY-MM-DD or null",
  "sentiment": "positive | neutral | mixed | negative",
  "topicsDiscussed": ["topic1", "topic2"]
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(cleaned);
}

// ─────────────────────────────────────────────────────────────────────────────
// chatWithAI
// General-purpose AI chat for the in-app assistant
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithAI(userMessage, conversationHistory = [], contextData = {}) {
  const systemPrompt = `You are an intelligent AI assistant for "AI Meeting-to-Action" — a productivity platform that converts meetings into structured tasks.

Your capabilities:
- Analyze and summarize meeting transcripts
- Extract action items, deadlines, and responsibilities
- Help users manage tasks and deadlines
- Provide smart recommendations based on workflow patterns
- Answer questions about meetings and tasks

Current context:
- Active Tasks: ${contextData.taskCount || 0}
- Pending Meetings: ${contextData.meetingCount || 0}
- User: ${contextData.userName || 'User'}

Be concise, helpful, and actionable. Format responses clearly with bullet points when listing items.`;

  const messages = [
    ...conversationHistory.slice(-10), // keep last 10 turns for context
    { role: 'user', content: userMessage },
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  return response.content[0].text;
}

// ─────────────────────────────────────────────────────────────────────────────
// generateTaskSuggestions
// Proactive AI follow-ups and deadline adjustments
// ─────────────────────────────────────────────────────────────────────────────
async function generateTaskSuggestions(tasks) {
  if (!tasks || tasks.length === 0) return [];

  const taskList = tasks.map(t => `- ${t.title} (${t.assignee}, due: ${t.deadline || 'no deadline'}, status: ${t.status})`).join('\n');

  const prompt = `Given these tasks from a meeting, generate 2-3 smart follow-up suggestions:

${taskList}

Respond with a JSON array of suggestions:
[
  {
    "type": "reminder | risk | recommendation",
    "message": "The suggestion text",
    "taskId": "task_id or null",
    "urgency": "high | medium | low"
  }
]`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(raw);
}

module.exports = { extractActionsFromTranscript, chatWithAI, generateTaskSuggestions };
