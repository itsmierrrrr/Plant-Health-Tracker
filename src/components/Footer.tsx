import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07101b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3 text-cream">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200 ring-1 ring-inset ring-leaf-300/20">
            <Leaf className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-cream">Verdant Lens</p>
            <p className="text-slate-400">Portfolio-quality AI plant health monitoring UI.</p>
          </div>
        </div>
        <p>Built with React, Vite, Tailwind CSS, and React Router.</p>
      </div>
    </footer>
  );
}