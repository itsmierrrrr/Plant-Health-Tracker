import { cn } from '../utils/cn';
import type { LucideIcon } from 'lucide-react';

type StatisticCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  className?: string;
};

export function StatisticCard({ label, value, detail, icon: Icon, className }: StatisticCardProps) {
  return (
    <article className={cn('rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-300/40', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-cream">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200 ring-1 ring-inset ring-leaf-300/20">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}