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
    <article className={cn('group rounded-3xl border border-[#dfe5d9] bg-[#f5f1e7] p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#86c4b7] hover:bg-[#eef8f5]', className)}>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#347c70]/20 to-[#86c4b7]/30 text-[#347c70] ring-1 ring-inset ring-[#b5ddd3] transition group-hover:scale-105">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-[#20312f]">{title}</h3>
      <p className="mt-3 leading-7 text-[#526460]">{description}</p>
    </article>
  );
}