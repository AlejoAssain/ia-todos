import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'danger' | 'dangerGhost' | 'ghost' | 'primary';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'px-3 py-2 text-xs',
};

const variantClasses: Record<ButtonVariant, string> = {
  danger: 'bg-rose-300 text-rose-950 hover:bg-rose-200 disabled:bg-rose-300/60',
  dangerGhost:
    'border border-rose-300/20 bg-rose-400/10 text-rose-100/80 hover:bg-rose-400/18 hover:text-rose-50 disabled:opacity-60',
  ghost:
    'border border-white/10 bg-white/5 text-violet-100/75 hover:bg-white/10 hover:text-white disabled:opacity-60',
  primary:
    'bg-violet-300 text-violet-950 hover:bg-violet-200 disabled:bg-violet-300/60',
};

export function Button({
  children,
  className = '',
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full font-semibold transition disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({
  children,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base font-bold text-violet-100/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
