interface NavbarProps {
  onCreateTaskClick: () => void;
}

export function Navbar({ onCreateTaskClick }: NavbarProps) {
  return (
    <nav className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/6 p-5 shadow-[0_28px_120px_rgba(10,5,22,0.58)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
          App
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          IA Todos
        </h1>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-full bg-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 transition hover:bg-violet-200"
        onClick={onCreateTaskClick}
        type="button"
      >
        <span className="text-base leading-none">+</span>
        New task
      </button>
    </nav>
  );
}
