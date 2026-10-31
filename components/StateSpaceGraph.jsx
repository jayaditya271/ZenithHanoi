'use client';

import React, { useMemo, useState } from 'react';
import { Network, Info, Eye, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { generateStateSpaceGraph, serializeState } from '../lib/hanoiAIEngine';

export default function StateSpaceGraph({
  currentState,
  numDisks,
  solutionPathKeys = [],
  onSelectState,
}) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Generate graph definition for current disk count (supports 3 disks for 27 states)
  const graphData = useMemo(() => {
    // For 3 disks, 27 states form the famous Sierpiński Gasket
    return generateStateSpaceGraph(Math.min(3, numDisks));
  }, [numDisks]);

  const currentKey = serializeState(currentState);

  // SVG viewBox coordinates
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 460;

  return (
    <section id="state-space" className="scroll-mt-24 w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                State Space Topology
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Sierpiński Gasket Graph (3^{Math.min(3, numDisks)} = {graphData.totalStates} States)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              State Space Search Topology
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every valid Tower of Hanoi configuration is a node in this fractal graph. Click any node to teleport.
            </p>
          </div>

          {/* Graph Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom Out State Space Graph"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom In State Space Graph"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                title="Reset Zoom to 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Graph Legend & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs py-3 border-b border-slate-800/60 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/50 animate-pulse"></span>
              Current State S
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Start S_0 (3,2,1||)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Goal S_g (||3,2,1)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-indigo-400"></span>
              Optimal Search Path
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            {hoveredNode ? (
              <span className="text-indigo-300 font-bold">
                Inspecting State: [{hoveredNode.id}]
              </span>
            ) : (
              <span>Hover or click nodes for state breakdown</span>
            )}
          </div>
        </div>

        {/* SVG Graph Canvas */}
        <div className="relative w-full flex items-center justify-center p-2 bg-slate-950/60 rounded-xl my-4 border border-slate-800/80 overflow-hidden">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full max-w-2xl h-auto transition-transform duration-300 select-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              {/* Radial glow for current active node */}
              <radialGradient id="activeNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Render Edges */}
            <g className="edges">
              {graphData.edges.map((edge) => {
                const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
                const targetNode = graphData.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const x1 = sourceNode.x * SVG_WIDTH;
                const y1 = sourceNode.y * SVG_HEIGHT;
                const x2 = targetNode.x * SVG_WIDTH;
                const y2 = targetNode.y * SVG_HEIGHT;

                // Check if this edge is on the optimal solution path
                const isOptimalEdge =
                  solutionPathKeys.includes(edge.source) &&
                  solutionPathKeys.includes(edge.target);

                return (
                  <line
                    key={edge.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isOptimalEdge ? '#6366f1' : '#1e293b'}
                    strokeWidth={isOptimalEdge ? 2.5 : 1}
                    strokeOpacity={isOptimalEdge ? 0.9 : 0.6}
                  />
                );
              })}
            </g>

            {/* Render Nodes */}
            <g className="nodes">
              {graphData.nodes.map((node) => {
                const cx = node.x * SVG_WIDTH;
                const cy = node.y * SVG_HEIGHT;
                const isCurrent = node.id === currentKey;
                const isOptimal = solutionPathKeys.includes(node.id);
                const isHovered = hoveredNode?.id === node.id;

                let fillColor = '#334155';
                let strokeColor = '#475569';
                let radius = 6;

                if (node.isInitial) {
                  fillColor = '#6366f1';
                  strokeColor = '#a5b4fc';
                  radius = 8;
                } else if (node.isGoal) {
                  fillColor = '#10b981';
                  strokeColor = '#6ee7b7';
                  radius = 8;
                } else if (isOptimal) {
                  fillColor = '#4f46e5';
                  strokeColor = '#818cf8';
                  radius = 7;
                }

                if (isCurrent) {
                  fillColor = '#06b6d4';
                  strokeColor = '#ffffff';
                  radius = 10;
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => onSelectState && onSelectState(node.state)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Active pulse aura */}
                    {isCurrent && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={20}
                        fill="url(#activeNodeGlow)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? radius + 3 : radius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      className="transition-all duration-150"
                    />

                    {/* Optional Mini-Label on Key Nodes */}
                    {(node.isInitial || node.isGoal || isCurrent) && (
                      <text
                        x={cx}
                        y={cy - 12}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {node.isInitial ? 'S_0' : node.isGoal ? 'S_g' : 'Active'}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* State Space Analysis Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Total State Space</span>
            <span className="font-bold text-slate-200 font-mono text-sm">
              |S| = 3^{Math.min(3, numDisks)} = {graphData.totalStates} Nodes
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Every disk has 3 possible peg assignments, forming the fractal Sierpiński graph.
            </p>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Optimal Path Cost</span>
            <span className="font-bold text-indigo-400 font-mono text-sm">
              2^{Math.min(3, numDisks)} - 1 = {Math.pow(2, Math.min(3, numDisks)) - 1} Transitions
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum Hamiltonian boundary cost between initial state S_0 and goal state S_g.
            </p>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Current Location</span>
            <span className="font-bold text-cyan-400 font-mono text-sm truncate block" title={currentKey}>
              [{currentKey || 'Empty'}]
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Live tracking node updates synchronously with each disk operator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
