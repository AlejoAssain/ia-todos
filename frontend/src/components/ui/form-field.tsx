import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

interface FieldShellProps {
  children: ReactNode;
  label: string;
}

export function FieldShell({ children, label }: FieldShellProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-violet-100">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none transition placeholder:text-violet-200/30 focus:border-violet-300/40 ${className}`}
      {...props}
    />
  );
}

export function TextArea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-violet-200/30 focus:border-violet-300/40 ${className}`}
      {...props}
    />
  );
}
