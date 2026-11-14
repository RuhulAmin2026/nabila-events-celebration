import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { AuthUser } from '../shared/types';

interface NavbarProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

const NAV_LINKS = [
  { label: 'Experiences', href: '#experiences' },
  { label: 'Resources', href: '#resources' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Past Events', href: '#past-events' },
  { label: 'Contact Us', href: '#contact' },
];

export function Navbar({ user, onOpenAuth, onOpenDashboard }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060919]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          aria-label="Nabila Events Celebration"
          className="inline-flex items-center bg-white rounded-lg px-2.5 py-1 shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
        >
          <img
            src="/assets/logo/Nabila_Events_Celebration_Logo_e40d021a.png"
            alt="Nabila Events Celebration"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#4B93FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Admin Panel
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-200 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden bg-[#080D23] border-t border-white/10 px-6 py-4 flex flex-col gap-3"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-200 hover:text-white py-1.5"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
