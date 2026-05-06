import { StatCard } from './stat-card';

interface TasksSummaryProps {
  completedSteps: number;
  totalSteps: number;
  totalTasks: number;
}

export function TasksSummary({
  completedSteps,
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
  );
}
