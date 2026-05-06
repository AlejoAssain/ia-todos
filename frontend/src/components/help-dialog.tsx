import { useEffect } from 'react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030c]/80 px-4 py-8 backdrop-blur-md">
      <button
        aria-label="Close help dialog"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <section
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/10 bg-[#120b21]/95 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.55)] sm:p-8"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
              Help
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              How to use IA Todos
            </h2>
          </div>

          <button
            aria-label="Close dialog"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-violet-100/70 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <div className="mt-7 space-y-3 text-sm leading-7 text-violet-100/72">
          <p>
            Create a task with a title. Add a description when you have extra
            context; otherwise IA Todos will infer it from the title.
          </p>
          <p>
            Click the number next to a step to mark it as done. Click it again
            to mark it as pending.
          </p>
          <p>
            Use Refresh tasks to sync the list after changes or when another
            device updates your tasks.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="rounded-full bg-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 transition hover:bg-violet-200"
            onClick={onClose}
            type="button"
          >
            Got it
          </button>
        </div>
      </section>
    </div>
  );
}
