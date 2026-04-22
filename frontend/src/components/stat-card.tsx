interface StatCardProps {
  label: string
  value: string
  accent?: string
}

export function StatCard({
  label,
  value,
  accent = 'from-fuchsia-400/30 to-violet-400/5',
}: StatCardProps) {
  return (
    <article
      className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accent} p-5 shadow-[0_24px_80px_rgba(48,16,90,0.35)] backdrop-blur`}
    >
      <p className="text-xs uppercase tracking-[0.32em] text-violet-200/70">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </article>
  )
}
