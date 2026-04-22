import { TaskCard } from './task-card'
import type { Task } from '../types/task'

interface TasksSectionProps {
  error: string | null
  isLoading: boolean
  onToggleStep: (stepId: number, completed: boolean) => Promise<void>
  tasks: Task[]
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-[28px] border border-white/8 bg-white/4"
        />
      ))}
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-[28px] border border-rose-400/25 bg-rose-400/10 p-6 text-rose-100">
      <p className="text-sm font-semibold uppercase tracking-[0.28em]">
        Could not load tasks
      </p>
      <p className="mt-3 text-sm leading-7 text-rose-50/85">{error}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-black/15 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-100/55">
        Empty state
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-white">No tasks yet</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-violet-100/60">
        Create your first task and it will show up here with its steps.
      </p>
    </div>
  )
}

export function TasksSection({
  error,
  isLoading,
  onToggleStep,
  tasks,
}: TasksSectionProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_64px_rgba(5,2,16,0.35)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
            List
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Tasks
          </h2>
        </div>
        <p className="text-sm text-violet-100/60">
          {isLoading
            ? 'Loading…'
            : `${tasks.length} task${tasks.length === 1 ? '' : 's'} loaded`}
        </p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {tasks.map((task) => (
              <TaskCard key={task.id} onToggleStep={onToggleStep} task={task} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
