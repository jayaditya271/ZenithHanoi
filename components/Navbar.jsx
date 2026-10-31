'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Cpu, Network, BookOpen, RotateCcw, Play, Sparkles } from 'lucide-react';

/**
 * Floating Minimalistic Brand Navbar
 * Automatically slides up on scroll down and slides down into view on scroll up.
 */
export default function Navbar({ onReset, onAutoPlay, isPlaying, algorithmName }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolling DOWN -> hide floating navbar
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        // Scrolling UP -> reveal floating navbar
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-transform duration-300 ease-in-out pointer-events-none ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
      }`}
    >
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-5 py-2.5 rounded-full border transition-all duration-300 max-w-5xl w-full ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border-slate-800 shadow-2xl shadow-indigo-950/30'
            : 'bg-slate-900/60 backdrop-blur-lg border-slate-800/80 shadow-lg'
        }`}
        aria-label="ZenithHanoi Main Navigation"
      >
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
          title="ZenithHanoi - AI State Space Search & Planning"
        >
          {/* Minimalist Geometric Logo */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px] shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-cyan-400"
              >
                <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
                <rect x="7" y="12" width="10" height="3" rx="1.5" fill="#818cf8" />
                <rect x="10" y="7" width="4" height="3" rx="1.5" fill="#a5b4fc" />
                <path d="M12 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider text-slate-100 flex items-center gap-1.5 font-mono">
              ZENITH<span className="text-indigo-400 font-bold">HANOI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest hidden sm:inline-block">
                AI Planner
              </span>
            </span>
          </div>
        </a>

        {/* Minimalist Navigation Anchors */}
        <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
          <a
            href="#visualizer"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Jump to Interactive Disk Transfer Simulator"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Simulator
          </a>
          <a
            href="#search-engine"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Jump to AI Search & Heuristic Evaluation Inspector"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            AI Search
          </a>
          <a
            href="#state-space"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Jump to State Space Sierpiński Topology Graph"
          >
            <Network className="w-3.5 h-3.5 text-violet-400" />
            State Space
          </a>
          <a
            href="#theory"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="View Classical AI Foundations & Heuristic Theory"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            AI Theory
          </a>
        </div>

        {/* Quick Simulation Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 rounded-full transition-all cursor-pointer"
            title="Reset Simulation to Initial State (S_0)"
            type="button"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onAutoPlay}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/40 hover:shadow-indigo-500/50'
            }`}
            title={isPlaying ? 'Pause AI Transfer Animation' : `Animate Transfers (${algorithmName || 'AI Search'})`}
            type="button"
          >
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Animate Plan</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
