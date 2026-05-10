<div align="center">

# IA Todos

**An AI-assisted task app that turns goals into actionable steps.**

  <p>
    <img alt="Status" src="https://img.shields.io/badge/status-MVP-green" />
    <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB" />
    <img alt="Backend" src="https://img.shields.io/badge/backend-NestJS-E0234E" />
    <img alt="Language" src="https://img.shields.io/badge/language-TypeScript-3178C6" />
    <img alt="AI" src="https://img.shields.io/badge/AI-Ollama%20or%20OpenAI-111827" />
  </p>
</div>

## Overview

`IA Todos` is a small product-focused project built around a simple problem: big or vague tasks are hard to start. The goal is to let a user enter an objective and use AI to break it down into concrete steps that are easier to execute.

This repository is currently in an MVP stage, and automated application tests are not implemented yet. The frontend and backend can create tasks, generate steps with AI, persist them, and track step completion.

Most todo apps are good at storing tasks, but not at helping people start them. `IA Todos` is meant to bridge that gap by turning "I need to do this" into a clearer sequence of next actions.

## Installation

### 1. Prerequisites

- `Docker Engine 20.10+` with `Docker Compose v2`
- Optional: `Node.js` 22+ and `npm` to use the root helper scripts
- `Ollama` installed locally for local AI mode, or an `OPENAI_API_KEY`

If you use Ollama, start the local service and pull the default model first:

```bash
ollama serve
ollama pull llama3.2:1b
```

The default Ollama model is `llama3.2:1b` because it is small and quick to run
for local development. You can use a different local model by setting
`OLLAMA_MODEL`.

### 2. Clone the repo

```bash
git clone <repo-url>
cd ia-todos
```

### 3. Run Production

With Docker directly:

```bash
docker compose up --build
```

Or with the helper script:

```bash
npm run start
```

The helper script asks which AI provider to use, checks Docker, builds the
images, and starts the app with Docker Compose. If you use Docker directly,
configure the provider with environment variables.

Frontend is available at:

```text
http://localhost:8080
```

To stop the app:

```bash
docker compose down
```

Or, if you used the helper script:

```bash
npm run stop
```

Optional production overrides:

```bash
FRONTEND_PORT=80 docker compose up --build
OLLAMA_MODEL=llama3.2:1b docker compose up --build
IA_PROVIDER=openai OPENAI_API_KEY="your_api_key_here" docker compose up --build
```

## Usage

1. Open `http://localhost:8080`.
2. Create a task with a clear title and, optionally, a short description.
3. The app generates suggested steps with the selected AI provider.
4. Mark steps as done as you progress.
5. Add, edit, or delete steps whenever the plan needs adjustment.

## Tech Stack

- Frontend: `React 19`, `Vite`, `TypeScript`
- Backend: `NestJS`, `TypeScript`
- AI: `Ollama` with `llama3.2:1b` or the `OpenAI API`
- Target persistence: `SQLite`

## Project Structure

```text
ia-todos/
├── frontend/   # React + Vite client
├── backend/    # NestJS API
└── README.md
```

## Development

### Run checks

```bash
npm test
```

This validates both launcher scripts and both Docker Compose files.

### Run the app in dev mode

The helper script asks which AI provider to use:

```bash
npm run dev
```

When you choose local Ollama, the script checks that the local Ollama service is
reachable before starting the app.

Choose:

- `1` for local Ollama.
- `2` for OpenAI API. The script will ask for `OPENAI_API_KEY` if it is not already exported.

Optional environment variables:

```bash
OLLAMA_MODEL=llama3.2:1b
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_MODEL=gpt-5
IA_PROVIDER=ollama # or openai
```

### Docker Compose Dev

This keeps the SQLite database as `backend/dev.sqlite`, exposes the backend at
`http://localhost:3000/api`, exposes the frontend at `http://localhost:5173`,
and points the backend container at Ollama running on the host machine.

Start Ollama on your host first:

```bash
ollama serve
ollama pull llama3.2:1b
```

Then run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Optional overrides:

```bash
OLLAMA_MODEL=llama3.2:1b docker compose -f docker-compose.dev.yml up --build
OLLAMA_BASE_URL=http://host.docker.internal:11434 docker compose -f docker-compose.dev.yml up --build
```

For OpenAI API mode instead of Ollama:

```bash
IA_PROVIDER=openai OPENAI_API_KEY="your_api_key_here" docker compose -f docker-compose.dev.yml up --build
```

### Run the backend manually

```bash
cd backend
npm install
npm run start:dev
```

API available at `http://localhost:3000/api`

For manual OpenAI API mode:

```bash
IA_PROVIDER=openai OPENAI_API_KEY="your_api_key_here" npm run start:dev
```

### Run the frontend manually

```bash
cd frontend
npm install
npm run dev
```

Frontend available at `http://localhost:5173`

## Product Direction

- Create tasks from a simple interface.
- Use AI to generate suggested steps for each task.
- Let users complete generated steps manually.
- Let users create, edit, and delete steps manually.
- Show overall progress at the task level.

## Current Status

- `frontend/` initialized with `React + Vite + TypeScript`.
- `backend/` initialized with `NestJS + TypeScript`.
- Backend exposes an `/api` base path and a `tasks` module.
- Tasks and generated steps are persisted with SQLite.
- AI generation can run through local Ollama or the OpenAI API.
- Step creation, editing, deletion, and completion are implemented.

## API Snapshot

The initial task module is mounted under:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/steps`
- `POST /api/steps/empty`
- `PATCH /api/steps/:stepId`
- `PATCH /api/steps/:stepId/status`
- `DELETE /api/steps/:stepId`

Task creation, AI step generation, listing, task updates, task deletion, and step CRUD are implemented.

## Roadmap

- [x] Set up separate frontend and backend apps
- [x] Bootstrap a NestJS API with a global `/api` prefix
- [x] Create the initial `tasks` module
- [x] Implement real entities and persistence
- [x] Generate task steps with AI
- [x] Support step completion tracking
- [x] Add task progress summaries
- [x] Connect frontend and backend flows
- [x] Add full step-level CRUD

## Notes for Reviewers

This project is intentionally being built as an MVP with a clean separation between UI, API, and AI integration concerns. At this stage, the most relevant signals are the project direction, architecture choice, and implementation path rather than feature completeness.
