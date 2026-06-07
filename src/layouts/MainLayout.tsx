import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import type { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#07101b] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(91,136,178,0.16),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(61,140,75,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%)]" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}