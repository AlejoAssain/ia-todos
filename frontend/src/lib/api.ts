import type { Task } from '../types/task';

interface CreateTaskInput {
  description?: string;
  title: string;
}

interface CreateStepInput {
  completed?: boolean;
  content: string;
  position?: number;
  taskId: number;
}

interface CreateEmptyStepInput {
  completed?: boolean;
  position?: number;
  taskId: number;
}

interface UpdateStepInput {
  completed?: boolean;
  content?: string;
  position?: number;
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

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to delete task (${response.status})`,
    );
  }
}

export async function createStep(input: CreateStepInput): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/steps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to create step (${response.status})`,
    );
  }
}

export async function createEmptyStep(
  input: CreateEmptyStepInput,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/steps/empty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to create step (${response.status})`,
    );
  }
}

export async function updateStep(
  stepId: number,
  input: UpdateStepInput,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to update step (${response.status})`,
    );
  }
}

export async function updateStepStatus(
  stepId: number,
  input: UpdateStepStatusInput,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/steps/${stepId}/status`, {
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

export async function deleteStep(stepId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to delete step (${response.status})`,
    );
  }
}
