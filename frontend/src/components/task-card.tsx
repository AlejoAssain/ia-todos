import type { Task } from '../types/task';
import { useState } from 'react';

interface TaskCardProps {
  onToggleStep: (stepId: number, completed: boolean) => Promise<void>;
  task: Task;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function TaskCard({ onToggleStep, task }: TaskCardProps) {
  const [pendingStepIds, setPendingStepIds] = useState<number[]>([]);
  const completedSteps = task.steps.filter((step) => step.completed).length;
  const progressLabel =
    task.steps.length === 0
      ? 'No steps yet'
      : `${completedSteps}/${task.steps.length} steps done`;

  async function handleToggleStep(stepId: number, completed: boolean) {
    setPendingStepIds((current) => [...current, stepId]);

    try {
      await onToggleStep(stepId, completed);
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

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-violet-200/50">
            Created
          </p>
          <p className="mt-2 text-sm font-medium text-violet-50">
            {formatDate(task.createdAt)}
          </p>
          <p className="mt-3 text-xs text-violet-200/60">{progressLabel}</p>
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
            {task.steps.map((step, index) => (
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
                  disabled={pendingStepIds.includes(step.id)}
                  onClick={() =>
                    void handleToggleStep(step.id, !step.completed)
                  }
                  type="button"
                >
                  {pendingStepIds.includes(step.id)
                    ? '...'
                    : step.completed
                      ? '✓'
                      : index + 1}
                </button>
                <p className="text-sm leading-6 text-violet-50/90">
                  {step.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-5 text-sm text-violet-100/60">
            This task does not have steps yet.
          </div>
        )}
      </div>
    </article>
  );
}
