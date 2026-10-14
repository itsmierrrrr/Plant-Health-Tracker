import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import type { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#20312f]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_8%_12%,rgba(233,185,73,0.12),transparent_26%),radial-gradient(circle_at_90%_8%,rgba(52,124,112,0.1),transparent_28%)]" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}