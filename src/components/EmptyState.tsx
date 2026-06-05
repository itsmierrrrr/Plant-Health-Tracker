import { cn } from '../utils/cn';
import type { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function EmptyState({ icon: Icon, title, description, actionLabel, className, ...buttonProps }: EmptyStateProps) {
  return (
    <div className={cn('rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center', className)}>
      <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-leaf-400/15 text-leaf-200 ring-1 ring-inset ring-leaf-300/20">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-semibold text-cream">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          {...buttonProps}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-cream px-5 py-3 text-sm font-semibold text-brand-900 transition hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}