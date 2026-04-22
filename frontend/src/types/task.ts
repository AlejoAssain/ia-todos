export interface Step {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  steps: Step[];
}
