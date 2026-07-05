import { Leaf } from 'lucide-react';
import { Instagram, Mail, Phone, Facebook } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#07101b]">
  {/* Top Row */}
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200 ring-1 ring-inset ring-leaf-300/20">
        <Leaf className="h-5 w-5" />
      </span>

      <div>
        <h3 className="font-semibold text-cream">Plant Pulse</h3>
        <p className="text-sm text-slate-400">
          Smart care for every plant.
        </p>
      </div>
    </div>

    {/* Social Icons */}
    <div className="flex items-center gap-5 text-truffle/80 dark:text-[#e7f2e4]/80">
      <a
        href="tel:9897169420"
        className="transition-colors hover:text-truffle dark:hover:text-[#e7f2e4]"
      >
        <Phone size={20} />
      </a>

      <a
        href="mailto:mihir.s.sawant17@gmail.com"
        className="transition-colors hover:text-truffle dark:hover:text-[#e7f2e4]"
      >
        <Mail size={20} />
      </a>

      <a
        href="https://instagram.com/mihir.s_"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-truffle dark:hover:text-[#e7f2e4]"
      >
        <Instagram size={20} />
      </a>

      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-truffle dark:hover:text-[#e7f2e4]"
      >
        <FaXTwitter size={20} />
      </a>

      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-truffle dark:hover:text-[#e7f2e4]"
      >
        <Facebook size={20} />
      </a>
    </div>
  </div>

  {/* Bottom Row */}
  <div className="border-t border-white/0">
    <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
      © {new Date().getFullYear()} Plant Pulse. All rights reserved.
    </div>
  </div>
</footer>
  );
}