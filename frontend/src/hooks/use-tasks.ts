import { useEffect, useState } from 'react';
import { getTasks } from '../lib/api';
import type { Task } from '../types/task';

interface UseTasksResult {
  error: string | null;
  isLoading: boolean;
  refreshTasks: (showLoadingState?: boolean) => Promise<void>;
  tasks: Task[];
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshTasks(showLoadingState = true) {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }

      setError(null);

      const nextTasks = await getTasks();

      setTasks(nextTasks);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading tasks.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialTasks() {
      try {
        const nextTasks = await getTasks();

        if (!isMounted) {
          return;
        }

        setTasks(nextTasks);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Something went wrong while loading tasks.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    error,
    isLoading,
    refreshTasks,
    tasks,
  };
}
