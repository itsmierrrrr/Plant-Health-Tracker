import { cn } from '../utils/cn';

type HealthScoreGaugeProps = {
  score: number;
  label?: string;
  className?: string;
};

export function HealthScoreGauge({ score, label = 'Health Score', className }: HealthScoreGaugeProps) {
  const value = Math.max(0, Math.min(score, 100));

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center shadow-soft', className)}>
      <div
        className="relative flex h-48 w-48 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(#5db06a ${value * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
      >
        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white/10 bg-[#09111d]">
          <div className="text-4xl font-bold text-cream">{value}%</div>
          <div className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-400">{label}</div>
        </div>
      </div>
      <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">A higher score indicates a healthier plant profile with fewer visible stress signals.</p>
    </div>
  );
}