import { cn } from '../utils/cn';
import { BadgeCheck, CalendarDays, Droplets, Sprout } from 'lucide-react';
import type { AnalysisItem } from '../data/mockData';

type AnalysisCardProps = {
  analysis: AnalysisItem;
  className?: string;
};

export function AnalysisCard({ analysis, className }: AnalysisCardProps) {
  return (
    <article className={cn('group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-leaf-400/30', className)}>
      <div className="relative h-48 overflow-hidden">
        <img src={analysis.image} alt={analysis.plantName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream">
          {analysis.status}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-cream">{analysis.plantName}</h3>
          <p className="mt-1 text-sm text-slate-400">{analysis.species}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-300">{analysis.notes}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">
            <BadgeCheck className="h-4 w-4 text-leaf-300" />
            {analysis.healthScore}% health
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">
            <Sprout className="h-4 w-4 text-leaf-300" />
            {analysis.confidence}% confidence
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">
            <CalendarDays className="h-4 w-4 text-leaf-300" />
            {analysis.date}
          </span>
        </div>
        <div className="rounded-2xl border border-leaf-400/15 bg-leaf-400/10 p-4 text-sm text-slate-200">
          <div className="mb-2 flex items-center gap-2 font-semibold text-leaf-200">
            <Droplets className="h-4 w-4" />
            Recommendation
          </div>
          <p>{analysis.recommendation}</p>
        </div>
      </div>
    </article>
  );
}