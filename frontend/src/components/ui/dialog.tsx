import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  children: ReactNode;
  closeDisabled?: boolean;
  description?: string;
  eyebrow: string;
  isOpen: boolean;
  maxWidthClassName?: string;
  onClose: () => void;
  title: string;
}

export function Dialog({
  children,
  closeDisabled = false,
  description,
  eyebrow,
  isOpen,
  maxWidthClassName = 'max-w-xl',
  onClose,
  title,
}: DialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !closeDisabled) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDisabled, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030c]/80 px-4 py-8 backdrop-blur-md">
      <button
        aria-label="Close dialog"
        className="absolute inset-0"
        disabled={closeDisabled}
        onClick={onClose}
        type="button"
      />

      <section
        aria-modal="true"
        className={`relative z-10 w-full ${maxWidthClassName} rounded-[32px] border border-white/10 bg-[#120b21]/95 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.55)] sm:p-8`}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-200/55">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-sm leading-7 text-violet-100/65">
                {description}
              </p>
            ) : null}
          </div>

          <button
            aria-label="Close dialog"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-violet-100/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={closeDisabled}
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        {children}
      </section>
    </div>,
    document.body,
  );
}
