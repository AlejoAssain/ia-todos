<div align="center">
  <img src="./frontend/src/assets/hero.png" alt="IA Todos logo" width="132" />

# IA Todos

**An AI-assisted task app that turns goals into actionable steps.**

  <p>
    <img alt="Status" src="https://img.shields.io/badge/status-WIP-orange" />
    <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB" />
    <img alt="Backend" src="https://img.shields.io/badge/backend-NestJS-E0234E" />
    <img alt="Language" src="https://img.shields.io/badge/language-TypeScript-3178C6" />
    <img alt="AI" src="https://img.shields.io/badge/AI-Ollama%20or%20OpenAI-111827" />
  </p>
</div>

## Overview

`IA Todos` is a small product-focused project built around a simple problem: big or vague tasks are hard to start. The goal is to let a user enter an objective and use AI to break it down into concrete, editable steps that are easier to execute.d

This repository is currently in the foundation stage. The frontend and backend structure are in place, and the next milestone is connecting real task, step, persistence, and AI-generation flows end to end.

## Product Direction

- Create tasks from a simple interface.
- Use AI to generate suggested steps for each task.
- Let users edit, complete, and delete steps manually.
- Show overall progress at the task level.

## Current Status

- `frontend/` initialized with `React + Vite + TypeScript`.
- `backend/` initialized with `NestJS + TypeScript`.
- Backend currently exposes an `/api` base path and an initial `tasks` module.
- `Ollama` is the planned local AI integration for the MVP.
- Full CRUD behavior, persistence, and AI workflow are still being implemented.

## Why It Matters

Most todo apps are good at storing tasks, but not at helping people start them. `IA Todos` is meant to bridge that gap by turning "I need to do this" into a clearer sequence of next actions.

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

## Getting Started

### 1. Prerequisites

- `Node.js` 20+
- `npm`
- `Ollama` installed locally for local AI mode, or an `OPENAI_API_KEY`
- Local model pulled when using Ollama:

```bash
ollama pull llama3.2:1b
```

### 2. Run the app

The helper script asks which AI provider to use:

```bash
./dev-start.zsh
```

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

### 3. Run the backend manually

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

### 4. Run the frontend manually

```bash
cd frontend
npm install
npm run dev
```

Frontend available at `http://localhost:5173`

## API Snapshot

The initial task module is mounted under:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

The route structure exists today, while the business logic is still in scaffold form.

## Roadmap

- [x] Set up separate frontend and backend apps
- [x] Bootstrap a NestJS API with a global `/api` prefix
- [x] Create the initial `tasks` module
- [ ] Implement real entities and persistence
- [ ] Generate task steps with AI
- [ ] Add full step-level CRUD
- [ ] Support step completion tracking
- [ ] Add task progress summaries
- [ ] Connect frontend and backend flows

## Notes for Reviewers

This project is intentionally being built as an MVP with a clean separation between UI, API, and AI integration concerns. At this stage, the most relevant signals are the project direction, architecture choice, and implementation path rather than feature completeness.
