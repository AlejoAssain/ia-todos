<div align="center">

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

`IA Todos` is a small product-focused project built around a simple problem: big or vague tasks are hard to start. The goal is to let a user enter an objective and use AI to break it down into concrete steps that are easier to execute.

This repository is currently in an MVP stage. The frontend and backend can create tasks, generate steps with AI, persist them, and track step completion.

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
