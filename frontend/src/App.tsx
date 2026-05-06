import { useState } from 'react';
import { CreateTaskDialog } from './components/create-task-dialog';
import { HelpDialog } from './components/help-dialog';
import { Navbar } from './components/navbar';
import { TasksSection } from './components/tasks-section';
import { TasksSummary } from './components/tasks-summary';
import { useTasks } from './hooks/use-tasks';
import {
  createStep,
  deleteStep,
  deleteTask,
  updateStep,
  updateStepStatus,
} from './lib/api';

function App() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const { error, isLoading, refreshTasks, tasks } = useTasks();

  const totalTasks = tasks.length;
  const totalSteps = tasks.reduce(
    (count, task) => count + task.steps.length,
    0,
  );
  const completedSteps = tasks.reduce(
    (count, task) => count + task.steps.filter((step) => step.completed).length,
    0,
  );

  async function handleToggleStep(stepId: number, completed: boolean) {
    await updateStepStatus(stepId, { completed });
    await refreshTasks(false);
  }

  async function handleCreateStep(taskId: number, content: string) {
    await createStep({ content, taskId });
    await refreshTasks(false);
  }

  async function handleUpdateStep(stepId: number, content: string) {
    await updateStep(stepId, { content });
    await refreshTasks(false);
  }

  async function handleDeleteStep(stepId: number) {
    await deleteStep(stepId);
    await refreshTasks(false);
  }

  async function handleDeleteTask(taskId: number) {
    await deleteTask(taskId);
    await refreshTasks(false);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-16 h-64 w-64 rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="absolute right-[12%] top-24 h-80 w-80 rounded-full bg-violet-500/16 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10">
        <Navbar
          onCreateTaskClick={() => setIsCreateDialogOpen(true)}
          onHelpClick={() => setIsHelpDialogOpen(true)}
        />
        <TasksSummary
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          totalTasks={totalTasks}
        />
        <TasksSection
          error={error}
          isLoading={isLoading}
          onCreateStep={handleCreateStep}
          onDeleteStep={handleDeleteStep}
          onDeleteTask={handleDeleteTask}
          onToggleStep={handleToggleStep}
          onUpdateStep={handleUpdateStep}
          tasks={tasks}
        />
      </main>

      {isCreateDialogOpen ? (
        <CreateTaskDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onTaskCreated={() => void refreshTasks()}
        />
      ) : null}

      {isHelpDialogOpen ? (
        <HelpDialog
          isOpen={isHelpDialogOpen}
          onClose={() => setIsHelpDialogOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default App;
