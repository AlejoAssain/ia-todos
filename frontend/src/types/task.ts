export interface Step {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  position: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  steps: Step[];
}
