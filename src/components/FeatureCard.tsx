import { cn } from '../utils/cn';
import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <article className={cn('group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-leaf-400/40 hover:bg-white/8', className)}>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-400/20 to-brand-400/20 text-leaf-200 ring-1 ring-inset ring-white/10 transition group-hover:scale-105">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-cream">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{description}</p>
    </article>
  );
}