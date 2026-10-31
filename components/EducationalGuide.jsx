'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Network, 
  Code, 
  Check, 
  Sparkles,
  Layers,
  Binary,
  Compass,
  Search
} from 'lucide-react';

export default function EducationalGuide() {
  const [activeTab, setActiveTab] = useState('statespace'); // 'statespace' | 'algorithms' | 'code'

  return (
    <section id="theory" className="scroll-mt-24 w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Knowledge Base & AI Theory
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Classical Artificial Intelligence Curriculum
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              AI State Space Search & Planning Foundations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Russell & Norvig formal state space formulation, heuristic admissibility, and search tree algorithms.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('statespace')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'statespace'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Learn about Formal State Space Formulation"
            >
              <Network className="w-3.5 h-3.5" />
              <span>State Space</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('algorithms')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'algorithms'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Learn about A*, BFS, DFS, and Admissible Heuristics"
            >
              <Search className="w-3.5 h-3.5" />
              <span>AI Search Algorithms</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Explore the unified lib/hanoiAIEngine.js architecture"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Engine Architecture</span>
            </button>
          </div>
        </div>

        {/* Tab 1: State Space Search */}
        {activeTab === 'statespace' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Concept 1: Formal State Space Formulation */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Formal State Space Representation
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong className="text-white">States S:</strong> 3-tuple [Peg A, Peg B, Peg C] representing disk sequences. State space size |S| = 3^N.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong className="text-white">Initial State S_0:</strong> All N disks stacked on Peg A ([N..1, [], []]).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong className="text-white">Goal State S_g:</strong> All N disks moved to Peg C ([], [], [N..1]).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong className="text-white">Legal Operator Preconditions:</strong> Move(d, from, to) valid &hArr; d = top(from) &and; (to is empty &or; d &lt; top(to)).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong className="text-white">Step Cost:</strong> Unit cost c(s, a, s&apos;) = 1 for each legal transfer.</span>
                  </li>
                </ul>
              </div>

              {/* Concept 2: The Sierpiński Fractal Graph */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  The Sierpiński Gasket Topology
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The complete state transition graph of Tower of Hanoi is isomorphic to the <strong className="text-violet-300">Sierpiński Triangle</strong> fractal graph.
                </p>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 mt-3 font-mono text-[11px] text-violet-300 space-y-1">
                  <div>3 Disks: |V| = 27 nodes, |E| = 39 edges</div>
                  <div>4 Disks: |V| = 81 nodes, |E| = 120 edges</div>
                  <div>Optimal Hamiltonian Path = 2^N - 1 moves</div>
                  <div>Branching factor: b &le; 3 at every state</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Search Algorithms & Heuristics */}
        {activeTab === 'algorithms' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informed Search: A* Algorithm */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  A* Heuristic Search & Admissibility
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A* evaluates nodes using <strong className="text-white font-mono">f(n) = g(n) + h(n)</strong>:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300 mt-2">
                  <li>&bull; <strong className="text-indigo-300">g(n):</strong> Path cost from root S_0 to current state n.</li>
                  <li>&bull; <strong className="text-cyan-300">h(n):</strong> Admissible heuristic estimating cost from n to goal S_g.</li>
                  <li>&bull; <strong className="text-emerald-300">Admissibility:</strong> Because h(n) &le; h*(n), A* is guaranteed to return an optimal solution!</li>
                </ul>
              </div>

              {/* Uninformed Search & Planning */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Comparison of Search Strategies
                </h3>
                <div className="space-y-2 text-xs text-slate-300 mt-1">
                  <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
                    <strong className="text-white">BFS (Breadth-First):</strong> Explores shallowest nodes first. Complete and optimal for unit step cost, but memory-intensive (stores full frontier).
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
                    <strong className="text-white">DFS (Depth-First):</strong> Explores deepest branch first with cycle detection. Low memory footprint, but not guaranteed optimal.
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
                    <strong className="text-white">Means-End AI Planner:</strong> Recursively decomposes goal into subgoals (move N-1 to aux, move N to goal, move N-1 to goal).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Unified Codebase Architecture */}
        {activeTab === 'code' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Self-Contained Educational AI Engine: lib/hanoiAIEngine.js
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The entire AI State Space Search, Admissible Heuristic Evaluation, and Search Algorithms are consolidated in a single, well-documented file:
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">1. State Representation</span>
                  serializeState, deserializeState, createInitialState, isGoalState.
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">2. Action Model</span>
                  getLegalMoves tests top disk and size constraint preconditions.
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">3. Admissible Heuristic</span>
                  computeHeuristic(state, n) returns lower bound remaining moves.
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">4. AI Algorithms</span>
                  solveWithAStar, solveWithBFS, solveWithDFS, solveWithGreedy, solveWithAIPlanner.
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">5. Sierpiński State Space Graph</span>
                  generateStateSpaceGraph creates full 3^N topological nodes and edges.
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">6. Universal Dispatcher</span>
                  solveTowerOfHanoi(numDisks, algorithm) benchmarks steps & metrics.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
