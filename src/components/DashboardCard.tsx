import { cn } from '../utils/cn';
import type { ReactNode } from 'react';

type DashboardCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ title, action, children, className }: DashboardCardProps) {
  return (
    <section className={cn('rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-soft', className)}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-cream">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}