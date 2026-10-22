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
    <article className={cn('rounded-3xl border border-[#dfe5d9] bg-[#f5f1e7] p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-300/40', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#708079]">{label}</p>
          <p className="mt-3 text-3xl font-bold text-[#20312f]">{value}</p>
          <p className="mt-2 text-sm text-[#708079]">{detail}</p>
        </div>
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ef] text-[#347c70] ring-1 ring-inset ring-leaf-300/20">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}