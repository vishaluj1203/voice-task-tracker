# Voice Task Tracker

A full-stack task management application with intelligent voice input that parses spoken commands to extract task details like title, priority, due date, and status.

## Project Setup

### Prerequisites

- **Node.js**: v18 or higher
- **Database**: SQLite (no additional setup required)
- **Browser**: Modern browser with Web Speech API support (Chrome, Edge recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-task-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   **Backend**: Copy the example file and configure:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   The `.env` file should contain:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   ```

   **Frontend**: Copy the example file (optional - defaults work for local development):
   ```bash
   cd frontend
   cp .env.example .env
   ```
   
   The `.env` file can contain:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```
   
   > **Note**: Frontend `.env` is optional. If not provided, it defaults to `http://localhost:3001`

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start Backend** (from `backend` directory):
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:3001`

2. **Start Frontend** (from `frontend` directory):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access Application**: Open `http://localhost:5173` in your browser

### Seed Data

No seed data is required. The application starts with an empty database. You can create tasks manually or use voice input.

### Project Structure

```
voice-task-tracker/
├── README.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── dev.db
│   └── src/
│       ├── server.js
│       ├── models/
│       │   └── index.js
│       ├── services/
│       │   ├── taskService.js
│       │   └── parserService.js
│       ├── controllers/
│       │   └── taskController.js
│       └── routes/
│           └── taskRoutes.js
└── frontend/
    ├── .env.example
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── index.js
        ├── components/
        │   ├── Header.jsx
        │   ├── TaskBoard.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskList.jsx
        │   ├── TaskModal.jsx
        │   ├── VoiceInput.jsx
        │   ├── ConfirmationModal.jsx
        │   ├── LoadingState.jsx
        │   └── EmptyState.jsx
        ├── hooks/
        │   ├── useTasks.js
        │   ├── useFilters.js
        │   ├── useViewState.js
        │   ├── useTaskModal.js
        │   └── useDeleteModal.js
        ├── constants/
        │   └── tasks.js
        └── styles/
            ├── index.css
            ├── base.css
            ├── components.css
            └── scrollbar.css
```

---

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Custom React hooks
- **HTTP Client**: Axios
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js with Express
- **Database**: SQLite with Prisma ORM
- **Architecture**: Controller-Service-Model pattern
- **Date Parsing**: date-fns
- **CORS**: Enabled for local development

### Key Libraries
- **Prisma**: Type-safe database client and migrations
- **Express**: Minimal web framework
- **Web Speech API**: Browser-native voice recognition (no external AI provider)

### Email Solution
Not implemented. This application does not include email functionality.

---

## API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Get All Tasks
```
GET /tasks
```

**Query Parameters** (all optional):
- `status`: Filter by status (TODO, IN_PROGRESS, DONE)
- `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `dueDate`: Filter by due date (YYYY-MM-DD)
- `search`: Search in title and description

**Success Response** (200):
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Transcript: \"Buy groceries tomorrow\"",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2024-12-05T09:00:00.000Z",
    "createdAt": "2024-12-04T10:00:00.000Z",
    "updatedAt": "2024-12-04T10:00:00.000Z"
  }
]
```

**Error Response** (500):
```json
{
  "error": "Failed to fetch tasks"
}
```

---

#### 2. Create Task
```
POST /tasks
```

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Get milk and bread",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-12-05"
}
```

**Success Response** (200):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Get milk and bread",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-12-05T00:00:00.000Z",
  "createdAt": "2024-12-04T10:00:00.000Z",
  "updatedAt": "2024-12-04T10:00:00.000Z"
}
```

**Error Response** (500):
```json
{
  "error": "Failed to create task"
}
```

---

#### 3. Update Task
```
PUT /tasks/:id
```

**Request Body**: Same as Create Task

**Success Response** (200): Returns updated task object

**Error Response** (500):
```json
{
  "error": "Failed to update task"
}
```

---

#### 4. Delete Task
```
DELETE /tasks/:id
```

**Success Response** (200):
```json
{
  "message": "Task deleted"
}
```

**Error Response** (500):
```json
{
  "error": "Failed to delete task"
}
```

---

#### 5. Parse Voice Input
```
POST /parse-task
```

**Request Body**:
```json
{
  "text": "Buy groceries tomorrow at 5 pm high priority"
}
```

**Success Response** (200):
```json
{
  "title": "Buy groceries",
  "priority": "HIGH",
  "dueDate": "2024-12-05T17:00:00.000Z",
  "status": "TODO"
}
```

**Error Response** (400):
```json
{
  "error": "Text is required"
}
```

**Error Response** (500):
```json
{
  "error": "Failed to parse task"
}
```

---

## Decisions & Assumptions

### Key Design Decisions

1. **Controller-Service-Model Architecture**
   - Separated concerns: controllers handle HTTP, services contain business logic, models manage data access
   - Makes the codebase more maintainable and testable

2. **Custom Hooks for State Management**
   - Created `useTasks`, `useFilters`, `useViewState`, `useTaskModal`, `useDeleteModal`
   - Reduces component complexity and improves reusability

3. **Constants for Magic Strings**
   - All task statuses and priorities are defined in `constants/tasks.js`
   - Prevents typos and makes refactoring easier

4. **Natural Language Parsing**
   - Built a custom parser instead of using an AI API
   - Keeps the app fast, free, and works offline
   - Supports common patterns: "tomorrow", "next Monday", "5 pm", "high priority"

5. **SQLite Database**
   - Simple setup, no external database server required
   - Perfect for local development and small-scale deployments

6. **Drag-and-Drop Task Management**
   - Used @hello-pangea/dnd for intuitive status updates
   - Tasks can be moved between TODO, IN_PROGRESS, and DONE columns

7. **Organized Folder Structure**
   - Backend: Controller-Service-Model layers in separate folders
   - Frontend: Organized by feature (components, hooks, api, constants, styles)
   - Improves code discoverability and maintainability

### Assumptions

1. **Voice Input Formats**
   - Users speak in natural English
   - Common time references: "tomorrow", "today", "next Monday", "next Friday"
   - Time formats: "5 pm", "6:30 am", "evening", "morning", "afternoon"
   - Priority keywords: "urgent", "high priority", "low priority"

2. **Browser Compatibility**
   - Web Speech API is available (Chrome, Edge)
   - Users grant microphone permissions

3. **Date Handling**
   - Empty date strings are treated as null
   - Dates are stored in UTC and displayed in local timezone

4. **No Authentication**
   - Single-user application
   - No login or user management

5. **No Email Integration**
   - This project does not send or receive emails
   - All task management is done through the web interface

---

## AI Tools Usage

### Tools Used

I built this application with the assistance of **Google Gemini (Antigravity)** throughout the entire development process.

### What AI Helped With

1. **Architecture Design**
   - Suggested Controller-Service-Model pattern for the backend
   - Recommended custom hooks for frontend state management
   - Helped design the component hierarchy

2. **Boilerplate Code**
   - Generated initial Express server setup
   - Created Prisma schema and migrations
   - Set up React components with Tailwind CSS

3. **Natural Language Parser**
   - Designed the parsing logic for voice input
   - Implemented date extraction using date-fns
   - Added support for time parsing (AM/PM, evening, morning)

4. **Debugging**
   - Fixed date persistence bug (empty strings vs null)
   - Resolved voice input caching issue in TaskModal
   - Fixed missing imports after refactoring

5. **Code Quality**
   - Set up ESLint for both frontend and backend
   - Refactored to use constants instead of magic strings
   - Extracted reusable components (LoadingState, EmptyState)
   - Organized code into logical folders (api, hooks, components, styles)

### Notable Prompts & Approaches

1. **"Refactor the frontend code to enhance modularity"**
   - Led to creating custom hooks and extracting UI state
   - Reduced App.jsx complexity significantly

2. **"Move hardcoded values to constants"**
   - Created `constants/tasks.js` for task-related constants
   - Replaced all magic strings with constants
   - API URL is configured via environment variable (`VITE_API_BASE_URL`)

3. **"Fix the date persistence bug"**
   - AI identified the issue: empty strings being converted to invalid dates
   - Suggested checking for both falsy values and empty strings

### What I Learned

1. **Better Code Organization**
   - Learned the value of separating concerns (Controller-Service-Model)
   - Understood how custom hooks can simplify React components

2. **Iterative Refactoring**
   - Started with a working monolithic app
   - Gradually refactored to improve maintainability
   - Each refactoring step was tested to ensure functionality remained intact

3. **Natural Language Processing**
   - Discovered that simple regex and keyword matching can handle many common use cases
   - Learned about date-fns utilities for date manipulation

4. **React Best Practices**
   - Using `useCallback` to prevent unnecessary re-renders
   - Extracting render logic into helper functions
   - Creating dedicated components for common UI patterns

5. **Database Design**
   - Learned how Prisma simplifies database migrations and type safety
   - Understood the importance of proper date handling in databases

---

## License

MIT
