'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HanoiVisualizer from '../components/HanoiVisualizer';
import AISearchInspector from '../components/AISearchInspector';
import StateSpaceGraph from '../components/StateSpaceGraph';
import EducationalGuide from '../components/EducationalGuide';
import Footer from '../components/Footer';
import confetti from 'canvas-confetti';
import { 
  createInitialState, 
  createGoalState, 
  isGoalState, 
  solveTowerOfHanoi, 
  serializeState,
  getLegalMoves,
  computeHeuristic
} from '../lib/hanoiAIEngine';
import { Sparkles, Layers, Cpu, Network, ArrowDown, BookOpen } from 'lucide-react';

export default function Home() {
  const [numDisks, setNumDisks] = useState(3);
  const [activeAlgorithm, setActiveAlgorithm] = useState('astar'); // 'astar' | 'bfs' | 'dfs' | 'greedy' | 'planner'
  const [currentState, setCurrentState] = useState(() => createInitialState(3));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(700); // ms per move
  const [lastMoveInfo, setLastMoveInfo] = useState(null);

  // Compute AI search solution for the chosen disk count and algorithm
  const searchSolution = useMemo(() => {
    return solveTowerOfHanoi(numDisks, activeAlgorithm);
  }, [numDisks, activeAlgorithm]);

  const solutionSteps = searchSolution.steps;
  const solutionPathKeys = searchSolution.pathKeys;

  const isGoalReached = useMemo(() => {
    return isGoalState(currentState, numDisks);
  }, [currentState, numDisks]);

  // Trigger confetti celebration when reaching goal state
  useEffect(() => {
    if (isGoalReached && currentStepIndex > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
      });
    }
  }, [isGoalReached, currentStepIndex]);

  // Step forward along AI solution path
  const handleStepForward = useCallback(() => {
    if (currentStepIndex < solutionSteps.length) {
      const nextStep = solutionSteps[currentStepIndex];
      setCurrentState(nextStep.stateSnapshot.map((p) => [...p]));
      setLastMoveInfo({
        disk: nextStep.disk,
        fromPeg: nextStep.fromPeg,
        toPeg: nextStep.toPeg,
        metrics: nextStep.metrics,
      });
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, solutionSteps]);

  // Step backward / undo transfer
  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 1) {
      const prevStep = solutionSteps[currentStepIndex - 2];
      setCurrentState(prevStep.stateSnapshot.map((p) => [...p]));
      setLastMoveInfo({
        disk: prevStep.disk,
        fromPeg: prevStep.fromPeg,
        toPeg: prevStep.toPeg,
        metrics: prevStep.metrics,
      });
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentStepIndex === 1) {
      setCurrentState(createInitialState(numDisks));
      setLastMoveInfo(null);
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, solutionSteps, numDisks]);

  // Reset simulation to initial state S_0
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentState(createInitialState(numDisks));
    setCurrentStepIndex(0);
    setLastMoveInfo(null);
  }, [numDisks]);

  // Handle disk count change
  const handleChangeNumDisks = (newCount) => {
    setIsPlaying(false);
    setNumDisks(newCount);
    setCurrentState(createInitialState(newCount));
    setCurrentStepIndex(0);
    setLastMoveInfo(null);
  };

  // Handle algorithm change
  const handleSelectAlgorithm = (algId) => {
    setIsPlaying(false);
    setActiveAlgorithm(algId);
    setCurrentState(createInitialState(numDisks));
    setCurrentStepIndex(0);
    setLastMoveInfo(null);
  };

  // Toggle automated execution playback
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStepIndex >= solutionSteps.length) {
        // Restart from beginning if reached end
        setCurrentState(createInitialState(numDisks));
        setCurrentStepIndex(0);
        setLastMoveInfo(null);
      }
      setIsPlaying(true);
    }
  };

  // Auto-play interval effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < solutionSteps.length) {
          handleStepForward();
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, solutionSteps.length, playbackSpeed, handleStepForward]);

  // Handle interactive manual moves from user
  const handleManualMove = (fromPeg, toPeg) => {
    const sourceStack = currentState[fromPeg];
    const disk = sourceStack[sourceStack.length - 1];

    const nextState = currentState.map((peg, idx) => {
      if (idx === fromPeg) return peg.slice(0, -1);
      if (idx === toPeg) return [...peg, disk];
      return [...peg];
    });

    const nextH = computeHeuristic(nextState, numDisks);
    const nextG = currentStepIndex + 1;

    setCurrentState(nextState);
    setCurrentStepIndex(nextG);
    setLastMoveInfo({
      disk,
      fromPeg,
      toPeg,
      metrics: {
        g: nextG,
        h: nextH,
        f: nextG + nextH,
      },
    });
  };

  // Jump to specific state selected from the State Space Graph
  const handleSelectState = (targetState) => {
    if (isPlaying) setIsPlaying(false);
    setCurrentState(targetState.map((p) => [...p]));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Floating Dynamic Navbar */}
      <Navbar
        onReset={handleReset}
        onAutoPlay={handleTogglePlay}
        isPlaying={isPlaying}
        algorithmName={searchSolution.algorithm}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-28 pb-12 flex flex-col gap-12">
        {/* Minimalistic Hero Branding */}
        <section className="text-center pt-4 pb-2 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Tower of Hanoi AI Planner &bull; State Space Search &bull; Move Counter
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Zenith<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">Hanoi</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Animate legal disk transfers, track path costs, and inspect formal <span className="text-slate-200 font-semibold">state space graph search</span> powered by <span className="text-cyan-300 font-semibold">A* Search, BFS, DFS, and Goal-Decomposition AI Planning</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a
              href="#visualizer"
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              title="Jump to the interactive Tower of Hanoi simulator"
            >
              <span>Explore Simulator</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <a
              href="#search-engine"
              className="px-5 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all cursor-pointer flex items-center gap-2"
              title="Inspect AI search heuristics and node expansions"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Search Engine</span>
            </a>
          </div>
        </section>

        {/* 1. Tower of Hanoi Interactive Visualizer with Move Counting */}
        <HanoiVisualizer
          state={currentState}
          numDisks={numDisks}
          currentStepIndex={currentStepIndex}
          totalMoves={solutionSteps.length}
          optimalMoves={searchSolution.optimalMoves}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          activeAlgorithm={activeAlgorithm}
          onSelectAlgorithm={handleSelectAlgorithm}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onChangeNumDisks={handleChangeNumDisks}
          onChangeSpeed={setPlaybackSpeed}
          onManualMove={handleManualMove}
          isGoalReached={isGoalReached}
          lastMoveInfo={lastMoveInfo}
        />

        {/* 2. Classical AI Search & Heuristic Evaluation Inspector */}
        <AISearchInspector
          currentState={currentState}
          numDisks={numDisks}
          searchSolution={searchSolution}
          currentStepIndex={currentStepIndex}
          lastMoveInfo={lastMoveInfo}
        />

        {/* 3. State Space Topology Graph (Sierpiński Gasket) */}
        <StateSpaceGraph
          currentState={currentState}
          numDisks={numDisks}
          solutionPathKeys={solutionPathKeys}
          onSelectState={handleSelectState}
        />

        {/* 4. Educational AI & State Space Theory Guide */}
        <EducationalGuide />
      </main>

      {/* Minimalist Footer with Copyright */}
      <Footer />
    </div>
  );
}
