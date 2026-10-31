'use client';

import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-20 border-t border-slate-800/80 bg-slate-950/80 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-cyan-400"
              >
                <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" />
                <rect x="7" y="12" width="10" height="3" rx="1.5" fill="#818cf8" />
                <rect x="10" y="7" width="4" height="3" rx="1.5" fill="#a5b4fc" />
              </svg>
            </div>
          </div>
          <div className="text-xs">
            <span className="font-mono font-bold text-slate-200">
              ZENITH<span className="text-indigo-400">HANOI</span>
            </span>
            <span className="text-slate-500 ml-2 text-[11px] hidden sm:inline">
              AI Planner & State Space Search Lab
            </span>
          </div>
        </div>

        {/* Simple Clean Copyright Line */}
        <p className="text-xs text-slate-500 text-center" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} ZenithHanoi AI Planner. All rights reserved.
        </p>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          title="Scroll back to top of page"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
