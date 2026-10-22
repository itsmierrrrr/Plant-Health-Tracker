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
    <div className={cn('rounded-3xl border border-dashed border-[#dfe5d9] bg-[#f5f1e7] p-10 text-center', className)}>
      <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f3ef] text-[#347c70] ring-1 ring-inset ring-[#b5ddd3]">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-semibold text-[#20312f]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-[#526460]">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          {...buttonProps}
          className="meadow-button mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}