import type { Task } from '../types/task';

interface CreateTaskInput {
  description?: string;
  title: string;
}

interface UpdateStepStatusInput {
  completed: boolean;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3000/api';

export async function getTasks(signal?: AbortSignal): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (${response.status})`);
  }

  return response.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to create task (${response.status})`,
    );
  }

  return response.json();
}

export async function updateStepStatus(
  stepId: number,
  input: UpdateStepStatusInput,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/steps/${stepId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to update step status (${response.status})`,
    );
  }
}
