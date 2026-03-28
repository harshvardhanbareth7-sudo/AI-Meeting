# 🤖 AI Meeting-to-Action System

> **Hackatron 3.0 — BIT Sindri**  
> Transform unstructured meeting conversations into structured, trackable action items — powered by Claude AI.

---

## 📌 Problem Statement

Meetings generate important decisions and responsibilities, but outcomes are frequently lost in unstructured discussions or scattered notes. Existing tools focus on recording or transcription — not on converting conversations into actionable workflows. This leads to missed tasks, unclear ownership, and reduced accountability.

## 🎯 Objective

Build an AI-powered system that converts meeting inputs (audio, transcripts, or notes) into structured, trackable tasks — enabling teams to move efficiently from discussion to execution.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ Audio Recording | Record meetings directly in-browser with real-time waveform |
| 📄 Transcript Input | Paste or type meeting notes / transcripts |
| 🤖 AI Extraction | Claude AI extracts tasks, deadlines, stakeholders & decisions |
| 📋 Task Dashboard | Visual Kanban-style board with filters and status tracking |
| 💬 AI Assistant | In-app chat assistant for meeting Q&A and workflow help |
| 🔔 Notifications | Automatic alerts for high-priority and overdue tasks |
| 🌗 Light/Dark Mode | Full theme support across all pages |
| 👤 User Profiles | Editable profiles with avatar upload |

---

## 🏗️ Project Structure

```
ai-meeting-action/
├── frontend/
│   ├── pages/
│   │   ├── landing.html        # Marketing / auth page
│   │   ├── home.html           # Main dashboard
│   │   └── meet-recorder.html  # Live recording & transcription
│   └── assets/
│       ├── css/                # Shared stylesheets (if extracted)
│       ├── js/                 # Shared scripts (if extracted)
│       └── img/                # Static images
│
├── backend/
│   ├── server.js               # Express app entry point
│   ├── config/
│   │   └── database.js         # DB connection (in-memory / MongoDB)
│   ├── routes/
│   │   ├── ai.js               # AI extraction & chat endpoints
│   │   ├── meetings.js         # Meeting CRUD
│   │   ├── tasks.js            # Task CRUD
│   │   ├── auth.js             # Register / Login / JWT
│   │   └── notifications.js    # Notification management
│   ├── services/
│   │   ├── aiService.js        # Claude API integration
│   │   └── dataStore.js        # In-memory data layer
│   └── middleware/
│       └── errorHandler.js     # Global error handling
│
├── docs/
│   └── api.md                  # API reference
│
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- An **Anthropic API key** ([get one here](https://console.anthropic.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-team/ai-meeting-action.git
cd ai-meeting-action
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set your API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
JWT_SECRET=your_random_secret_here
```

### 4. Start the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### 5. Open in Browser

```
http://localhost:5000
```

You'll land on the landing page. Click **Get Started** to sign up, then explore the dashboard.

---

## 🌐 Pages & Navigation

| URL | Page | Description |
|---|---|---|
| `/` or `/pages/landing.html` | Landing | Marketing page with login / signup |
| `/pages/home.html` | Dashboard | Main task & meeting management hub |
| `/pages/meet-recorder.html` | Recorder | Live audio recording & transcription |

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user (Bearer token) |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/extract` | Extract tasks from transcript/notes |
| POST | `/ai/chat` | Chat with AI assistant |
| POST | `/ai/suggest` | Get proactive task suggestions |

#### Example: Extract Tasks

```bash
curl -X POST http://localhost:5000/api/ai/extract \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q3 Planning Meeting",
    "transcript": "Alice will prepare the budget report by next Friday. Bob needs to set up the new dev environment by Monday. We decided to launch in September.",
    "source": "text"
  }'
```

**Response:**
```json
{
  "meeting": { "id": "...", "title": "Q3 Planning Meeting", ... },
  "tasks": [
    {
      "id": "task_1",
      "title": "Prepare budget report",
      "assignee": "Alice",
      "deadline": "2025-08-01",
      "priority": "high",
      "status": "pending"
    },
    {
      "id": "task_2",
      "title": "Set up dev environment",
      "assignee": "Bob",
      "deadline": "2025-07-28",
      "priority": "medium",
      "status": "pending"
    }
  ]
}
```

### Meetings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/meetings` | List all meetings |
| GET | `/meetings/:id` | Get meeting + tasks |
| POST | `/meetings` | Create meeting manually |
| PUT | `/meetings/:id` | Update meeting |
| DELETE | `/meetings/:id` | Delete meeting |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List tasks (filters: status, priority, assignee) |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create task manually |
| PATCH | `/tasks/:id` | Update task (status, deadline, etc.) |
| DELETE | `/tasks/:id` | Delete task |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | Get all notifications |
| POST | `/notifications` | Create notification |
| PATCH | `/notifications/:id/read` | Mark as read |

---

## 🤖 AI Architecture

```
Meeting Input (audio / transcript / notes)
         │
         ▼
  ┌─────────────┐
  │ Transcription│  ← Deepgram / OpenAI Whisper / Google STT
  │   (audio)   │
  └──────┬──────┘
         │
         ▼
  ┌─────────────────────────────┐
  │        Claude AI (Sonnet)   │
  │                             │
  │  • Task extraction          │
  │  • Deadline detection       │
  │  • Stakeholder mapping      │
  │  • Sentiment analysis       │
  │  • Smart suggestions        │
  └──────────────┬──────────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
   Task Dashboard    AI Chat Assistant
   (structured)      (conversational)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **AI / LLM** | Anthropic Claude (claude-sonnet) |
| **Transcription** | Deepgram / OpenAI Whisper / Google STT |
| **Auth** | JWT + bcryptjs |
| **Database** | In-memory store (MongoDB-ready) |
| **Security** | Helmet, CORS, Rate Limiting |

---

## 🧩 Agentic AI Component

The AI agent proactively:

- **Tracks task progress** — monitors status changes and flags stalled items
- **Sends intelligent follow-ups** — auto-generates reminder notifications for overdue tasks
- **Adjusts deadlines contextually** — suggests revised deadlines when workload conflicts are detected
- **Flags delays** — marks tasks at risk based on deadline proximity and current status
- **Answers meeting questions** — conversational assistant with full meeting context

---

## 📈 Expected Impact

- ✅ **Improved accountability** — every decision has a named owner
- ✅ **Reduced information loss** — no more post-meeting amnesia
- ✅ **Faster execution** — tasks are created and assigned in seconds
- ✅ **Better collaboration** — shared, transparent task visibility

---

## 🔧 Optional: MongoDB Setup

To persist data beyond server restarts:

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Add to `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-meeting-action
   ```
3. The app will automatically switch from in-memory to MongoDB

---

## 📝 License

MIT License — built for Hackatron 3.0, BIT Sindri.

---

## 👥 Team

Built with ❤️ at **Hackatron 3.0, BIT Sindri**

> *"From conversations to action — automatically."*
