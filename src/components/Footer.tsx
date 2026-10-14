import { Facebook, Instagram, Mail, PhoneCall, Sprout } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { BotanicalImage } from './BotanicalImage';

export function Footer() {
  return (
    <footer className="border-t border-[#dfe5d9] bg-[#fffdf7]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#347c70] text-[#fffdf7] shadow-lg shadow-[#347c70]/20">
            <Sprout className="h-6 w-6" strokeWidth={1.8} />
          </span>

          <div>
            <h3 className="font-display text-lg font-semibold text-cream">Plant Pulse</h3>
            <p className="text-sm text-slate-400">Smart care for every plant.</p>
          </div>
        </div>

        {/* <BotanicalImage
          alt="Small botanical leaves"
          className="hidden h-16 w-36 rounded-2xl p-1 sm:block"
          aspectClassName="aspect-[2.4/1]"
          imageClassName="rounded-xl"
          src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=500&q=80"
        /> */}

        <nav aria-label="Contact and social links" className="flex items-center gap-2">
          <a href="tel:9897169420" aria-label="Call Plant Pulse" title="Call Plant Pulse" className="footer-icon-link">
            <PhoneCall size={18} strokeWidth={1.8} />
          </a>
          <a href="mailto:mihir.s.sawant17@gmail.com" aria-label="Email Plant Pulse" title="Email Plant Pulse" className="footer-icon-link">
            <Mail size={18} strokeWidth={1.8} />
          </a>
          <a href="https://instagram.com/mihir.s_" target="_blank" rel="noopener noreferrer" aria-label="Plant Pulse on Instagram" title="Instagram" className="footer-icon-link">
            <Instagram size={18} strokeWidth={1.8} />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Plant Pulse on X" title="X" className="footer-icon-link">
            <FaXTwitter size={17} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Plant Pulse on Facebook" title="Facebook" className="footer-icon-link">
            <Facebook size={18} strokeWidth={1.8} />
          </a>
        </nav>
      </div>

      <div className="border-t border-[#dfe5d9]">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Plant Pulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}