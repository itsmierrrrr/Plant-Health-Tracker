import { cn } from '../utils/cn';
import { BadgeCheck, CalendarDays, Droplets, Sprout } from 'lucide-react';
import type { AnalysisItem } from '../data/mockData';
import { ResponsiveImage } from './ResponsiveImage';

type AnalysisCardProps = {
  analysis: AnalysisItem;
  className?: string;
};

export function AnalysisCard({ analysis, className }: AnalysisCardProps) {
  return (
    <article className={cn('group overflow-hidden rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] shadow-soft transition duration-300 hover:-translate-y-1 hover:border-leaf-400/30', className)}>
      <div className="relative h-48 overflow-hidden">
        <ResponsiveImage src={analysis.image} alt={analysis.plantName} sizes="(min-width: 1024px) 33vw, 100vw" className="transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173a36]/75 via-[#173a36]/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#fffdf7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#20312f]">
          {analysis.status}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-[#20312f]">{analysis.plantName}</h3>
          <p className="mt-1 text-sm text-[#708079]">{analysis.species}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[#526460]">{analysis.notes}</p>
        <div className="flex flex-wrap gap-3 text-sm text-[#526460]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">
            <BadgeCheck className="h-4 w-4 text-[#28685e]" />
            {analysis.healthScore}% health
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">
            <Sprout className="h-4 w-4 text-[#28685e]" />
            {analysis.confidence}% confidence
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">
            <CalendarDays className="h-4 w-4 text-[#28685e]" />
            {analysis.date}
          </span>
        </div>
        <div className="rounded-2xl border border-leaf-400/15 bg-[#eef8f5] p-4 text-sm text-[#3d514d]">
          <div className="mb-2 flex items-center gap-2 font-semibold text-[#347c70]">
            <Droplets className="h-4 w-4" />
            Recommendation
          </div>
          <p>{analysis.recommendation}</p>
        </div>
      </div>
    </article>
  );
}