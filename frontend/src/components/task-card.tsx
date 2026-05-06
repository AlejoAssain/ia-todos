import { useState, type FormEvent } from 'react';
import type { Step, Task } from '../types/task';
import { ConfirmDialog } from './confirm-dialog';
import { Button } from './ui/button';
import { TextInput } from './ui/form-field';

interface TaskCardProps {
  onCreateStep: (taskId: number, content: string) => Promise<void>;
  onDeleteStep: (stepId: number) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onToggleStep: (stepId: number, completed: boolean) => Promise<void>;
  onUpdateStep: (stepId: number, content: string) => Promise<void>;
  task: Task;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function TaskCard({
  onCreateStep,
  onDeleteStep,
  onDeleteTask,
  onToggleStep,
  onUpdateStep,
  task,
}: TaskCardProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingStepIds, setDeletingStepIds] = useState<number[]>([]);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { id: number; type: 'step' } | { type: 'task' } | null
  >(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  const [newStepContent, setNewStepContent] = useState('');
  const [pendingStepIds, setPendingStepIds] = useState<number[]>([]);
  const [savingStepIds, setSavingStepIds] = useState<number[]>([]);

  const completedSteps = task.steps.filter((step) => step.completed).length;
  const progressLabel =
    task.steps.length === 0
      ? 'No steps yet'
      : `${completedSteps}/${task.steps.length} steps done`;
  const orderedSteps = [...task.steps].sort((firstStep, secondStep) => {
    if (firstStep.position === secondStep.position) {
      return firstStep.id - secondStep.id;
    }

    return firstStep.position - secondStep.position;
  });

  function beginEdit(step: Step) {
    setActionError(null);
    setEditingStepId(step.id);
    setEditingContent(step.content);
  }

  function cancelEdit() {
    setEditingStepId(null);
    setEditingContent('');
  }

  async function handleCreateStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = newStepContent.trim();

    if (content.length < 2) {
      setActionError('Step content needs at least 2 characters.');
      return;
    }

    setIsCreatingStep(true);
    setActionError(null);

    try {
      await onCreateStep(task.id, content);
      setNewStepContent('');
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not create the step.',
      );
    } finally {
      setIsCreatingStep(false);
    }
  }

  async function confirmDeleteStep(stepId: number) {
    setDeletingStepIds((current) => [...current, stepId]);
    setActionError(null);

    try {
      await onDeleteStep(stepId);
      setPendingDelete(null);
      if (editingStepId === stepId) {
        cancelEdit();
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not delete the step.',
      );
    } finally {
      setDeletingStepIds((current) => current.filter((id) => id !== stepId));
    }
  }

  async function confirmDeleteTask() {
    setIsDeletingTask(true);
    setActionError(null);

    try {
      await onDeleteTask(task.id);
      setPendingDelete(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not delete the task.',
      );
      setIsDeletingTask(false);
    }
  }

  function handleConfirmDelete() {
    if (!pendingDelete) {
      return;
    }

    if (pendingDelete.type === 'task') {
      void confirmDeleteTask();
      return;
    }

    void confirmDeleteStep(pendingDelete.id);
  }

  async function handleSaveStep(stepId: number) {
    const content = editingContent.trim();

    if (content.length < 2) {
      setActionError('Step content needs at least 2 characters.');
      return;
    }

    setSavingStepIds((current) => [...current, stepId]);
    setActionError(null);

    try {
      await onUpdateStep(stepId, content);
      cancelEdit();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not update the step.',
      );
    } finally {
      setSavingStepIds((current) => current.filter((id) => id !== stepId));
    }
  }

  async function handleToggleStep(stepId: number, completed: boolean) {
    setPendingStepIds((current) => [...current, stepId]);
    setActionError(null);

    try {
      await onToggleStep(stepId, completed);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not update the step.',
      );
    } finally {
      setPendingStepIds((current) => current.filter((id) => id !== stepId));
    }
  }

  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(5,2,16,0.45)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-violet-100/80">
              Task #{task.id}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                task.completed
                  ? 'bg-emerald-400/15 text-emerald-200'
                  : 'bg-amber-400/15 text-amber-200'
              }`}
            >
              {task.completed ? 'Completed' : 'In progress'}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {task.title}
            </h3>
            {task.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-7 text-violet-100/72">
                {task.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:min-w-44">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-violet-200/50">
              Created
            </p>
            <p className="mt-2 text-base font-semibold text-violet-50">
              {formatDate(task.createdAt)}
            </p>
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs font-medium text-violet-200/65">
                {progressLabel}
              </p>
            </div>
          </div>

          <Button
            className="w-full justify-center"
            disabled={isDeletingTask}
            onClick={() => setPendingDelete({ type: 'task' })}
            size="sm"
            variant="dangerGhost"
          >
            {isDeletingTask ? 'Deleting task' : 'Delete task'}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.26em] text-violet-200/55">
            Suggested steps
          </p>
          <p className="text-sm text-violet-100/65">
            {task.steps.length} total
          </p>
        </div>

        {task.steps.length > 0 ? (
          <ul className="space-y-2">
            {orderedSteps.map((step, index) => {
              const isDeleting = deletingStepIds.includes(step.id);
              const isEditing = editingStepId === step.id;
              const isPending = pendingStepIds.includes(step.id);
              const isSaving = savingStepIds.includes(step.id);

              return (
                <li
                  key={step.id}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3"
                >
                  <button
                    aria-label={
                      step.completed
                        ? 'Mark step as not done'
                        : 'Mark step as done'
                    }
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      step.completed
                        ? 'bg-emerald-400/20 text-emerald-200'
                        : 'bg-violet-400/15 text-violet-100 hover:bg-violet-400/25'
                    }`}
                    disabled={isPending || isDeleting || isSaving}
                    onClick={() =>
                      void handleToggleStep(step.id, !step.completed)
                    }
                    type="button"
                  >
                    {isPending
                      ? '...'
                      : step.completed
                        ? '✓'
                        : step.position || index + 1}
                  </button>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <TextInput
                          className="min-w-0 flex-1"
                          disabled={isSaving}
                          maxLength={200}
                          minLength={2}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                          value={editingContent}
                        />
                        <div className="flex shrink-0 gap-2">
                          <Button
                            disabled={isSaving}
                            onClick={() => void handleSaveStep(step.id)}
                            size="sm"
                          >
                            {isSaving ? 'Saving' : 'Save'}
                          </Button>
                          <Button
                            disabled={isSaving}
                            onClick={cancelEdit}
                            size="sm"
                            variant="ghost"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-sm leading-6 ${
                          step.completed
                            ? 'text-violet-100/55 line-through decoration-emerald-200/50'
                            : 'text-violet-50/90'
                        }`}
                      >
                        {step.content}
                      </p>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        aria-label="Edit step"
                        disabled={isDeleting || isPending}
                        onClick={() => beginEdit(step)}
                        size="sm"
                        title="Edit"
                        variant="ghost"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label="Delete step"
                        disabled={isDeleting || isPending}
                        onClick={() =>
                          setPendingDelete({ id: step.id, type: 'step' })
                        }
                        size="sm"
                        title="Delete"
                        variant="dangerGhost"
                      >
                        {isDeleting ? '...' : 'Delete'}
                      </Button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-5 text-sm text-violet-100/60">
            This task does not have steps yet.
          </div>
        )}

        <form
          className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3 sm:flex-row"
          onSubmit={handleCreateStep}
        >
          <TextInput
            className="min-w-0 flex-1"
            disabled={isCreatingStep}
            maxLength={200}
            minLength={2}
            onChange={(event) => setNewStepContent(event.target.value)}
            placeholder="Add a new step"
            value={newStepContent}
          />
          <Button disabled={isCreatingStep} type="submit">
            {isCreatingStep ? 'Adding' : 'Add step'}
          </Button>
        </form>

        {actionError ? (
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {actionError}
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        confirmLabel={
          pendingDelete?.type === 'task' ? 'Delete task' : 'Delete step'
        }
        description={
          pendingDelete?.type === 'task'
            ? 'This will delete the task and all of its steps. This action cannot be undone.'
            : 'This will delete this step. This action cannot be undone.'
        }
        isOpen={pendingDelete !== null}
        isSubmitting={
          pendingDelete?.type === 'task'
            ? isDeletingTask
            : pendingDelete?.type === 'step' &&
              deletingStepIds.includes(pendingDelete.id)
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title={pendingDelete?.type === 'task' ? 'Delete task?' : 'Delete step?'}
      />
    </article>
  );
}
