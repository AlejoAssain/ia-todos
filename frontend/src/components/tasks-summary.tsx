import { StatCard } from './stat-card'

interface TasksSummaryProps {
  completedSteps: number
  lastUpdated: Date | null
  onRefresh: () => void
  totalSteps: number
  totalTasks: number
}

export function TasksSummary({
  completedSteps,
  lastUpdated,
  onRefresh,
  totalSteps,
  totalTasks,
}: TasksSummaryProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_28px_120px_rgba(10,5,22,0.42)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
            Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Tasks summary
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 transition hover:bg-violet-200"
            onClick={onRefresh}
            type="button"
          >
            Refresh tasks
          </button>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-violet-100/60">
            {lastUpdated
              ? `Last sync ${lastUpdated.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'Waiting for first sync'}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Tasks"
          value={String(totalTasks)}
          accent="from-violet-400/30 to-violet-950/10"
        />
        <StatCard
          label="Total steps"
          value={String(totalSteps)}
          accent="from-fuchsia-400/25 to-violet-950/10"
        />
        <StatCard
          label="Completed steps"
          value={String(completedSteps)}
          accent="from-indigo-400/25 to-violet-950/10"
        />
      </div>
    </section>
  )
}
