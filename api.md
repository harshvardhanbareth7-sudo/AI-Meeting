# API Reference — AI Meeting-to-Action

Base URL: `http://localhost:5000/api`

All endpoints return JSON. Error responses follow:
```json
{ "error": "Error message here", "path": "/api/...", "timestamp": "..." }
```

---

## Authentication

### POST /auth/register
Register a new user account.

**Body:**
```json
{ "name": "Alice", "email": "alice@example.com", "password": "securepass123" }
```
**Response 201:**
```json
{ "token": "eyJ...", "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
```

---

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "alice@example.com", "password": "securepass123" }
```
**Response 200:**
```json
{ "token": "eyJ...", "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
```

---

### GET /auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{ "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
```

---

## AI Endpoints

### POST /ai/extract
Core endpoint. Sends a meeting transcript/notes to Claude AI and returns structured tasks, summary, stakeholders, and decisions.

**Body:**
```json
{
  "title": "Sprint Planning Q3",
  "transcript": "Full meeting text here...",
  "source": "text",
  "userId": "optional-user-id"
}
```

**Response 200:**
```json
{
  "meeting": { "id": "uuid", "title": "...", "summary": "...", "createdAt": "..." },
  "tasks": [
    {
      "id": "task_1",
      "title": "Deploy backend to staging",
      "description": "Set up CI/CD pipeline and deploy...",
      "assignee": "Bob",
      "deadline": "2025-08-05",
      "priority": "high",
      "status": "pending",
      "tags": ["devops", "deployment"]
    }
  ],
  "aiResult": {
    "summary": "...",
    "keyDecisions": ["..."],
    "stakeholders": [{ "name": "Bob", "role": "Engineer", "tasksCount": 2 }],
    "topicsDiscussed": ["deployment", "Q3 goals"],
    "sentiment": "positive",
    "followUpDate": "2025-08-10"
  }
}
```

---

### POST /ai/chat
Conversational AI assistant with meeting context.

**Body:**
```json
{
  "message": "What tasks are overdue?",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ],
  "userId": "optional",
  "userName": "Alice"
}
```

**Response 200:**
```json
{ "reply": "You have 2 overdue tasks: ..." }
```

---

### POST /ai/suggest
Get proactive AI suggestions based on current task state.

**Body:**
```json
{ "userId": "optional" }
```

**Response 200:**
```json
{
  "suggestions": [
    {
      "type": "reminder",
      "message": "Bob's deployment task is due tomorrow — check in.",
      "taskId": "task_1",
      "urgency": "high"
    }
  ]
}
```

---

## Meetings

### GET /meetings
List all meetings.

**Query params:** `userId` (optional)

**Response 200:**
```json
{ "meetings": [...], "total": 5 }
```

---

### GET /meetings/:id
Get a single meeting with its tasks.

**Response 200:**
```json
{ "meeting": { ... }, "tasks": [...] }
```

---

### POST /meetings
Create a meeting manually (without AI extraction).

**Body:**
```json
{ "title": "Weekly Standup", "transcript": "optional text", "userId": "optional" }
```

**Response 201:**
```json
{ "meeting": { "id": "...", "title": "...", ... } }
```

---

### PUT /meetings/:id
Update a meeting.

**Body:** Any meeting fields to update.

---

### DELETE /meetings/:id
Delete a meeting and its associated tasks.

**Response 200:**
```json
{ "message": "Meeting deleted successfully" }
```

---

## Tasks

### GET /tasks
List all tasks with optional filters.

**Query params:**
- `status` — `pending | in-progress | done | blocked`
- `priority` — `high | medium | low`
- `assignee` — partial name match
- `userId` — optional

**Response 200:**
```json
{
  "tasks": [...],
  "stats": {
    "total": 10,
    "pending": 4,
    "inProgress": 3,
    "done": 2,
    "overdue": 1
  }
}
```

---

### PATCH /tasks/:id
Update task fields (status, deadline, assignee, priority).

**Body:**
```json
{ "status": "in-progress", "deadline": "2025-08-15" }
```

---

## Notifications

### GET /notifications
**Query params:** `userId`

**Response 200:**
```json
{
  "notifications": [...],
  "unread": 3
}
```

---

### PATCH /notifications/:id/read
Mark a notification as read.

**Response 200:**
```json
{ "notification": { "id": "...", "read": true, ... } }
```
