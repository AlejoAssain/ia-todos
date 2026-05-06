import { useEffect, useState, type FormEvent } from 'react';
import { createTask } from '../lib/api';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      await createTask({
        description: description.trim() || undefined,
        title,
      });

      onClose();
      onTaskCreated();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not create the task.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030c]/80 px-4 py-8 backdrop-blur-md">
      <button
        aria-label="Close create task dialog"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <section className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-[#120b21]/95 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
              New task
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Create a task
            </h2>
            <p className="mt-3 text-sm leading-7 text-violet-100/65">
              Add a title and, optionally, a short description. The backend will
              generate the first set of steps with AI.
            </p>
          </div>

          <button
            aria-label="Close dialog"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-violet-100/70 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-violet-100">Title</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-violet-200/30 focus:border-violet-300/40"
              maxLength={50}
              minLength={3}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Plan my mom's birthday pizza"
              required
              type="text"
              value={title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-violet-100">
              Description optional
            </span>
            <textarea
              className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-violet-200/30 focus:border-violet-300/40"
              maxLength={150}
              minLength={5}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Keep it simple, homemade, and ready before dinner."
              value={description}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-violet-100/75 transition hover:bg-white/10 hover:text-white"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:bg-violet-300/60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
