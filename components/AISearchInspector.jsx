'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Activity, 
  CheckCircle,
  Binary,
  Layers,
  Search,
  Check,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { computeHeuristic, getLegalMoves, serializeState } from '../lib/hanoiAIEngine';

export default function AISearchInspector({
  currentState,
  numDisks,
  searchSolution,
  currentStepIndex,
  lastMoveInfo,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentKey = serializeState(currentState);
  const currentH = computeHeuristic(currentState, numDisks);
  const currentG = currentStepIndex;
  const currentF = currentG + currentH;

  const legalMoves = getLegalMoves(currentState);
  const pegNames = ['Peg A', 'Peg B', 'Peg C'];

  return (
    <section id="search-engine" className="scroll-mt-24 w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                AI Search Diagnostics
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Search className="w-3 h-3 text-indigo-400" />
                State Space Heuristic Evaluation
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              AI Evaluation & Search Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inspection of path cost g(n), admissible heuristic h(n), total evaluation f(n), and candidate operator expansion.
            </p>
          </div>

          {/* Active Algorithm Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-300">Active Solver:</span>
              <span className="text-indigo-400 font-bold">
                {searchSolution?.algorithm || 'A* Heuristic Search'}
              </span>
            </div>
          </div>
        </div>

        {/* Evaluation Metrics Cards (g, h, f) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          {/* Card 1: g(n) Path Cost */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Path Cost g(n)</span>
              <span className="text-indigo-400 font-bold">Moves Made</span>
            </div>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono">
              {currentG}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Exact number of legal transitions from initial state S_0.
            </p>
          </div>

          {/* Card 2: h(n) Admissible Heuristic */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Heuristic h(n)</span>
              <span className="text-cyan-400 font-bold">Remaining Est.</span>
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              {currentH}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Lower bound estimated moves to goal (admissible: h &le; h*).
            </p>
          </div>

          {/* Card 3: f(n) = g(n) + h(n) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Evaluation f(n)</span>
              <span className="text-emerald-400 font-bold">Total Est.</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {currentF}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              f(n) = g(n) + h(n), guiding A* exploration toward minimal path.
            </p>
          </div>

          {/* Card 4: Search Space Efficiency */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Nodes Explored</span>
              <span className="text-amber-400 font-bold">Closed Set</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {searchSolution?.nodesExplored || 0}
            </div>
            <p className="text-[11px] text-slate-500 mt-1" suppressHydrationWarning>
              Total states expanded during offline AI search ({isMounted ? `${searchSolution?.executionTimeMs ?? 0} ms` : 'benchmarked'}).
            </p>
          </div>
        </div>

        {/* Candidate Operators & Action Expansion Table */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legal Operator Successor Generator */}
          <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">
                  &part;
                </span>
                Legal Successor Operators From Current State
              </h3>
              <span className="text-[11px] font-mono text-indigo-400">
                {legalMoves.length} Legal Transitions
              </span>
            </div>

            <div className="space-y-2">
              {legalMoves.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 text-center">
                  Goal state reached or no operators available.
                </div>
              ) : (
                legalMoves.map((m, idx) => {
                  const nextH = computeHeuristic(m.nextState, numDisks);
                  const nextG = currentG + 1;
                  const nextF = nextG + nextH;

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                      title={`Operator: Move Disk ${m.disk} from ${pegNames[m.fromPeg]} to ${pegNames[m.toPeg]}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px] font-bold">
                          Disk {m.disk}
                        </span>
                        <span className="text-slate-300">
                          {pegNames[m.fromPeg]} &rarr; {pegNames[m.toPeg]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-slate-400">
                          h(s&apos;) = <span className="text-cyan-400 font-bold">{nextH}</span>
                        </span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-slate-400">
                          f(s&apos;) = <span className="text-emerald-400 font-bold">{nextF}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Branching Factor: b &le; 3</span>
              <span>Operator Cost: c(s, a, s&apos;) = 1</span>
            </div>
          </div>

          {/* Admissible Heuristic Theory & Precondition Formulation */}
          <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">
                    H
                  </span>
                  Admissible Heuristic Mathematical Formulation
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                In classical AI, a heuristic <strong className="text-white">h(n)</strong> is <strong className="text-emerald-400">admissible</strong> if it never overestimates the true cost to reach the goal:
              </p>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 my-3 font-mono text-xs text-emerald-300 space-y-1">
                <div>h(n) &le; h*(n), &forall; n &isin; S</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  h(n) = &sum; [ 2^(d - 1) ] for each misplaced disk d &isin; &#123;1..N&#125;
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Because every misplaced disk <em className="text-slate-300">d</em> requires at least <code className="text-indigo-300">2^(d-1)</code> moves to clear the smaller disks above it, transfer it, and reconstruct the sub-tower, <code className="text-emerald-300">h(n)</code> is both <strong>admissible</strong> and <strong>consistent</strong> (monotonic), guaranteeing <strong>A* tree and graph search optimality</strong>.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Optimality Guarantee: Guaranteed Minimal Moves</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

