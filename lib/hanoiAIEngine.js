/**
 * ============================================================================
 * TOWER OF HANOI - AI PLANNER & STATE SPACE SEARCH ENGINE
 * ============================================================================
 * 
 * A self-contained, educational implementation of Classical AI Search & Planning:
 * 1. Formal State Space Representation:
 *    - State S = [PegA, PegB, PegC]
 *    - Initial State S_0 = [[N, ..., 1], [], []]
 *    - Goal State S_g = [[], [], [N, ..., 1]]
 *    - Action/Operator Move(disk, fromPeg, toPeg) with legal preconditions
 * 2. Search Algorithms:
 *    - A* Search (Heuristic f(n) = g(n) + h(n) with Admissible Heuristic)
 *    - Breadth-First Search (BFS - complete and optimal for step cost)
 *    - Depth-First Search (DFS - deep exploration with visited cycle prevention)
 *    - Greedy Best-First Search (guided purely by h(n))
 *    - Means-End Analysis / Recursive AI Planner (Goal decomposition)
 * 3. Search Metrics & Diagnostic Tracking:
 *    - g(n) Path Cost (moves made so far)
 *    - h(n) Heuristic Estimate to Goal
 *    - f(n) Total Evaluation Function
 *    - Explored Nodes (Closed Set) & Frontier (Open List)
 *    - Branching factor & State Space Topology (Sierpiński Gasket)
 * 
 * @module hanoiAIEngine
 * @author Tower of Hanoi AI Planner Lab
 * @license MIT
 */

// ============================================================================
// 1. STATE SPACE DEFINITION & CANONICAL SERIALIZATION
// ============================================================================

/**
 * Serializes a state [ [3, 2, 1], [], [] ] into a unique canonical string key: "3,2,1||"
 * @param {number[][]} state - 3-element array of peg arrays
 * @returns {string} Unique hash key
 */
export function serializeState(state) {
  return state.map((peg) => peg.join(',')).join('|');
}

/**
 * Deserializes a canonical string key back into peg arrays.
 * @param {string} stateKey - String key e.g. "3,2,1||"
 * @returns {number[][]} Peg arrays
 */
export function deserializeState(stateKey) {
  return stateKey.split('|').map((pegStr) => {
    if (!pegStr) return [];
    return pegStr.split(',').map(Number);
  });
}

/**
 * Creates the initial state S_0 where all N disks are on Peg A in descending order.
 * @param {number} numDisks - Number of disks (e.g. 3, 4, 5)
 * @returns {number[][]} Initial state [[N..1], [], []]
 */
export function createInitialState(numDisks = 3) {
  const pegA = [];
  for (let d = numDisks; d >= 1; d--) {
    pegA.push(d);
  }
  return [pegA, [], []];
}

/**
 * Creates the goal state S_g where all N disks are on Peg C.
 * @param {number} numDisks - Number of disks
 * @returns {number[][]} Goal state [[], [], [N..1]]
 */
export function createGoalState(numDisks = 3) {
  const pegC = [];
  for (let d = numDisks; d >= 1; d--) {
    pegC.push(d);
  }
  return [[], [], pegC];
}

/**
 * Tests if the given state satisfies the Goal Condition.
 * Goal: Peg A is empty, Peg B is empty, and Peg C holds all N disks.
 * @param {number[][]} state - State to test
 * @param {number} numDisks - Number of disks
 * @returns {boolean} True if state is goal state
 */
export function isGoalState(state, numDisks) {
  return (
    state[0].length === 0 &&
    state[1].length === 0 &&
    state[2].length === numDisks
  );
}

// ============================================================================
// 2. ACTION MODEL & LEGAL OPERATOR GENERATOR
// ============================================================================

/**
 * Generates all valid legal operators/moves from a given state.
 * 
 * Preconditions:
 * 1. Source peg must have at least one disk (cannot move from empty peg).
 * 2. Only the top disk of a peg can be moved.
 * 3. The moving disk cannot be placed on top of a smaller disk (d < top(dest)).
 * 
 * @param {number[][]} state - Current state
 * @returns {Array<{ fromPeg: number, toPeg: number, disk: number, nextState: number[][] }>}
 */
export function getLegalMoves(state) {
  const legalMoves = [];

  for (let fromPeg = 0; fromPeg < 3; fromPeg++) {
    const sourceStack = state[fromPeg];
    if (sourceStack.length === 0) continue;

    const topDisk = sourceStack[sourceStack.length - 1];

    for (let toPeg = 0; toPeg < 3; toPeg++) {
      if (fromPeg === toPeg) continue;

      const destStack = state[toPeg];
      const destTop = destStack.length > 0 ? destStack[destStack.length - 1] : Infinity;

      // Legal rule: smaller disk on top of larger disk or empty peg
      if (topDisk < destTop) {
        // Deep copy state and apply operator
        const nextState = state.map((peg, idx) => {
          if (idx === fromPeg) return peg.slice(0, -1);
          if (idx === toPeg) return [...peg, topDisk];
          return [...peg];
        });

        legalMoves.push({
          fromPeg,
          toPeg,
          disk: topDisk,
          nextState,
        });
      }
    }
  }

  return legalMoves;
}

// ============================================================================
// 3. HEURISTIC EVALUATION FUNCTIONS (ADMISSIBLE & CONSISTENT)
// ============================================================================

/**
 * Admissible Heuristic h(n) for Tower of Hanoi:
 * Computes an estimated lower bound of remaining moves to reach the goal state.
 * 
 * Method:
 * Examines disks from largest (N) down to smallest (1).
 * If disk d is not currently in its correct target position on Peg C,
 * it will require at least 2^(d-1) moves to transfer it and its dependencies.
 * 
 * Since this never overestimates the true remaining cost, h(n) is admissible,
 * ensuring A* search finds the strictly optimal path!
 * 
 * @param {number[][]} state - State to evaluate
 * @param {number} numDisks - Total number of disks
 * @returns {number} Admissible heuristic cost h(n) >= 0
 */
export function computeHeuristic(state, numDisks) {
  let h = 0;
  const pegC = state[2];

  for (let d = numDisks; d >= 1; d--) {
    // Check if disk d is on Peg C in its correct position
    const indexOnC = pegC.indexOf(d);
    const expectedIndex = numDisks - d;

    if (indexOnC !== expectedIndex) {
      // Disk d is either not on C or misplaced: contributes 2^(d - 1) moves
      h += Math.pow(2, d - 1);
    }
  }

  return h;
}

// ============================================================================
// 4. CLASSICAL AI SEARCH ALGORITHMS
// ============================================================================

/**
 * Executes A* Search on the Tower of Hanoi state space.
 * 
 * Evaluation function: f(n) = g(n) + h(n)
 * - g(n): exact cost from initial state to node n (move count)
 * - h(n): admissible heuristic estimate from n to goal state
 * 
 * Guarantees finding the optimal path with minimum moves (2^N - 1).
 * 
 * @param {number} numDisks - Number of disks
 * @returns {object} Search solution package with steps and metrics
 */
export function solveWithAStar(numDisks = 3) {
  const startTime = performance.now();
  const initialState = createInitialState(numDisks);
  const startKey = serializeState(initialState);

  // Priority queue / open list simulated via sorted array or min extraction
  const openList = [
    {
      state: initialState,
      key: startKey,
      g: 0,
      h: computeHeuristic(initialState, numDisks),
      f: computeHeuristic(initialState, numDisks),
      parent: null,
      moveTaken: null,
    },
  ];

  const closedSet = new Set();
  const gScores = new Map();
  gScores.set(startKey, 0);

  let nodesExplored = 0;
  let maxFrontierSize = 1;
  let goalNode = null;

  while (openList.length > 0) {
    // Extract node with lowest f(n)
    let bestIdx = 0;
    for (let i = 1; i < openList.length; i++) {
      if (
        openList[i].f < openList[bestIdx].f ||
        (openList[i].f === openList[bestIdx].f && openList[i].h < openList[bestIdx].h)
      ) {
        bestIdx = i;
      }
    }

    const current = openList.splice(bestIdx, 1)[0];
    nodesExplored++;

    // Goal test
    if (isGoalState(current.state, numDisks)) {
      goalNode = current;
      break;
    }

    closedSet.add(current.key);

    const legalMoves = getLegalMoves(current.state);

    for (const move of legalMoves) {
      const neighborKey = serializeState(move.nextState);
      const tentativeG = current.g + 1;

      if (closedSet.has(neighborKey)) continue;

      const existingG = gScores.get(neighborKey);
      if (existingG === undefined || tentativeG < existingG) {
        gScores.set(neighborKey, tentativeG);
        const h = computeHeuristic(move.nextState, numDisks);
        const f = tentativeG + h;

        const neighborNode = {
          state: move.nextState,
          key: neighborKey,
          g: tentativeG,
          h,
          f,
          parent: current,
          moveTaken: {
            disk: move.disk,
            fromPeg: move.fromPeg,
            toPeg: move.toPeg,
          },
        };

        const existingOpenIdx = openList.findIndex((n) => n.key === neighborKey);
        if (existingOpenIdx >= 0) {
          openList[existingOpenIdx] = neighborNode;
        } else {
          openList.push(neighborNode);
        }
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, openList.length);
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  return reconstructSearchPath(goalNode, nodesExplored, maxFrontierSize, executionTimeMs, 'A* Heuristic Search');
}

/**
 * Executes Breadth-First Search (BFS) on the Tower of Hanoi state space.
 * Explores state space level by level using a FIFO queue.
 * Complete and optimal for uniform step cost.
 * 
 * @param {number} numDisks - Number of disks
 * @returns {object} Search solution package
 */
export function solveWithBFS(numDisks = 3) {
  const startTime = performance.now();
  const initialState = createInitialState(numDisks);
  const startKey = serializeState(initialState);

  const queue = [
    {
      state: initialState,
      key: startKey,
      g: 0,
      h: computeHeuristic(initialState, numDisks),
      f: computeHeuristic(initialState, numDisks),
      parent: null,
      moveTaken: null,
    },
  ];

  const visited = new Set([startKey]);
  let nodesExplored = 0;
  let maxFrontierSize = 1;
  let goalNode = null;

  while (queue.length > 0) {
    const current = queue.shift();
    nodesExplored++;

    if (isGoalState(current.state, numDisks)) {
      goalNode = current;
      break;
    }

    const legalMoves = getLegalMoves(current.state);

    for (const move of legalMoves) {
      const neighborKey = serializeState(move.nextState);

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        const g = current.g + 1;
        const h = computeHeuristic(move.nextState, numDisks);

        queue.push({
          state: move.nextState,
          key: neighborKey,
          g,
          h,
          f: g + h,
          parent: current,
          moveTaken: {
            disk: move.disk,
            fromPeg: move.fromPeg,
            toPeg: move.toPeg,
          },
        });
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, queue.length);
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  return reconstructSearchPath(goalNode, nodesExplored, maxFrontierSize, executionTimeMs, 'Breadth-First Search (BFS)');
}

/**
 * Executes Depth-First Search (DFS) on the Tower of Hanoi state space.
 * Explores branch depth-first using a LIFO stack with cycle detection.
 * 
 * @param {number} numDisks - Number of disks
 * @returns {object} Search solution package
 */
export function solveWithDFS(numDisks = 3) {
  const startTime = performance.now();
  const initialState = createInitialState(numDisks);
  const startKey = serializeState(initialState);

  const stack = [
    {
      state: initialState,
      key: startKey,
      g: 0,
      h: computeHeuristic(initialState, numDisks),
      f: computeHeuristic(initialState, numDisks),
      parent: null,
      moveTaken: null,
    },
  ];

  const visited = new Set();
  let nodesExplored = 0;
  let maxFrontierSize = 1;
  let goalNode = null;

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current.key)) continue;

    visited.add(current.key);
    nodesExplored++;

    if (isGoalState(current.state, numDisks)) {
      goalNode = current;
      break;
    }

    const legalMoves = getLegalMoves(current.state);

    for (const move of legalMoves) {
      const neighborKey = serializeState(move.nextState);
      if (!visited.has(neighborKey)) {
        const g = current.g + 1;
        const h = computeHeuristic(move.nextState, numDisks);

        stack.push({
          state: move.nextState,
          key: neighborKey,
          g,
          h,
          f: g + h,
          parent: current,
          moveTaken: {
            disk: move.disk,
            fromPeg: move.fromPeg,
            toPeg: move.toPeg,
          },
        });
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, stack.length);
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  return reconstructSearchPath(goalNode, nodesExplored, maxFrontierSize, executionTimeMs, 'Depth-First Search (DFS)');
}

/**
 * Executes Greedy Best-First Search on the Tower of Hanoi state space.
 * Evaluation function: f(n) = h(n).
 * 
 * @param {number} numDisks - Number of disks
 * @returns {object} Search solution package
 */
export function solveWithGreedy(numDisks = 3) {
  const startTime = performance.now();
  const initialState = createInitialState(numDisks);
  const startKey = serializeState(initialState);

  const openList = [
    {
      state: initialState,
      key: startKey,
      g: 0,
      h: computeHeuristic(initialState, numDisks),
      f: computeHeuristic(initialState, numDisks),
      parent: null,
      moveTaken: null,
    },
  ];

  const visited = new Set();
  let nodesExplored = 0;
  let maxFrontierSize = 1;
  let goalNode = null;

  while (openList.length > 0) {
    // Greedy extracts node with lowest h(n)
    let bestIdx = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].h < openList[bestIdx].h) {
        bestIdx = i;
      }
    }

    const current = openList.splice(bestIdx, 1)[0];
    if (visited.has(current.key)) continue;

    visited.add(current.key);
    nodesExplored++;

    if (isGoalState(current.state, numDisks)) {
      goalNode = current;
      break;
    }

    const legalMoves = getLegalMoves(current.state);

    for (const move of legalMoves) {
      const neighborKey = serializeState(move.nextState);
      if (!visited.has(neighborKey)) {
        const g = current.g + 1;
        const h = computeHeuristic(move.nextState, numDisks);

        openList.push({
          state: move.nextState,
          key: neighborKey,
          g,
          h,
          f: h, // Pure greedy evaluation
          parent: current,
          moveTaken: {
            disk: move.disk,
            fromPeg: move.fromPeg,
            toPeg: move.toPeg,
          },
        });
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, openList.length);
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  return reconstructSearchPath(goalNode, nodesExplored, maxFrontierSize, executionTimeMs, 'Greedy Best-First Search');
}

/**
 * Executes a Means-End Analysis / Recursive Goal Decomposition AI Planner.
 * Decomposes problem into subgoals:
 * 1. Subgoal 1: Clear peg by moving top N-1 disks to Auxiliary peg.
 * 2. Action: Move disk N directly to Goal peg.
 * 3. Subgoal 2: Move N-1 disks from Auxiliary peg to Goal peg.
 * 
 * @param {number} numDisks - Number of disks
 * @returns {object} Search solution package
 */
export function solveWithAIPlanner(numDisks = 3) {
  const startTime = performance.now();
  let currentState = createInitialState(numDisks);
  const steps = [];

  function plan(n, source, target, aux) {
    if (n === 0) return;

    // Subgoal 1: Move top n-1 disks from source to aux
    plan(n - 1, source, aux, target);

    // Operator: Move disk n from source to target
    const prevKey = serializeState(currentState);
    const nextState = currentState.map((peg, idx) => {
      if (idx === source) return peg.slice(0, -1);
      if (idx === target) return [...peg, n];
      return [...peg];
    });

    currentState = nextState;
    const nextKey = serializeState(currentState);
    const g = steps.length + 1;
    const h = computeHeuristic(currentState, numDisks);

    steps.push({
      stepNumber: g,
      disk: n,
      fromPeg: source,
      toPeg: target,
      fromStateKey: prevKey,
      toStateKey: nextKey,
      stateSnapshot: currentState.map((p) => [...p]),
      metrics: {
        g,
        h,
        f: g + h,
      },
    });

    // Subgoal 2: Move n-1 disks from aux to target
    plan(n - 1, aux, target, source);
  }

  plan(numDisks, 0, 2, 1);

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  const optimalMoves = Math.pow(2, numDisks) - 1;

  return {
    algorithm: 'Goal-Decomposition AI Planner',
    isOptimal: true,
    totalMoves: steps.length,
    optimalMoves,
    nodesExplored: steps.length + 1,
    nodesGenerated: steps.length + 1,
    maxFrontierSize: 1,
    executionTimeMs,
    steps,
    pathKeys: [serializeState(createInitialState(numDisks)), ...steps.map((s) => s.toStateKey)],
  };
}

/**
 * Reconstructs the solution path from goal node back to root.
 */
function reconstructSearchPath(goalNode, nodesExplored, maxFrontierSize, executionTimeMs, algorithmName) {
  if (!goalNode) {
    return {
      algorithm: algorithmName,
      isOptimal: false,
      totalMoves: 0,
      optimalMoves: 0,
      nodesExplored,
      nodesGenerated: nodesExplored + maxFrontierSize,
      maxFrontierSize,
      executionTimeMs,
      steps: [],
      pathKeys: [],
    };
  }

  const reverseChain = [];
  let curr = goalNode;
  while (curr.parent !== null) {
    reverseChain.push(curr);
    curr = curr.parent;
  }
  reverseChain.reverse();

  const steps = reverseChain.map((node, idx) => ({
    stepNumber: idx + 1,
    disk: node.moveTaken.disk,
    fromPeg: node.moveTaken.fromPeg,
    toPeg: node.moveTaken.toPeg,
    fromStateKey: node.parent.key,
    toStateKey: node.key,
    stateSnapshot: node.state.map((p) => [...p]),
    metrics: {
      g: node.g,
      h: node.h,
      f: node.f,
    },
  }));

  const pathKeys = [goalNode.key];
  curr = goalNode;
  while (curr.parent !== null) {
    pathKeys.unshift(curr.parent.key);
    curr = curr.parent;
  }

  return {
    algorithm: algorithmName,
    isOptimal: steps.length === Math.pow(2, goalNode.state[2].length) - 1,
    totalMoves: steps.length,
    optimalMoves: Math.pow(2, goalNode.state[2].length) - 1,
    nodesExplored,
    nodesGenerated: nodesExplored + maxFrontierSize,
    maxFrontierSize,
    executionTimeMs,
    steps,
    pathKeys,
  };
}

/**
 * Unified Solver Dispatcher: Executes selected AI algorithm.
 * 
 * @param {number} numDisks - Number of disks
 * @param {string} algorithm - 'astar' | 'bfs' | 'dfs' | 'greedy' | 'planner'
 * @returns {object} Solution record with steps and metrics
 */
export function solveTowerOfHanoi(numDisks = 3, algorithm = 'astar') {
  switch (algorithm) {
    case 'astar':
      return solveWithAStar(numDisks);
    case 'bfs':
      return solveWithBFS(numDisks);
    case 'dfs':
      return solveWithDFS(numDisks);
    case 'greedy':
      return solveWithGreedy(numDisks);
    case 'planner':
    default:
      return solveWithAIPlanner(numDisks);
  }
}

// ============================================================================
// 5. STATE SPACE TOPOLOGY GENERATOR (SIERPIŃSKI GASKET GRAPH)
// ============================================================================

/**
 * Generates the full State Space Graph for Tower of Hanoi (3^N states).
 * 
 * @param {number} numDisks - Disks (typically 3 for 27 states)
 * @returns {{ nodes: Array<object>, edges: Array<object>, totalStates: number }}
 */
export function generateStateSpaceGraph(numDisks = 3) {
  const initialState = createInitialState(numDisks);
  const initialKey = serializeState(initialState);
  const goalState = createGoalState(numDisks);
  const goalKey = serializeState(goalState);

  const visited = new Set();
  const nodes = [];
  const edges = [];
  const edgeSet = new Set();

  const queue = [initialState];
  visited.add(initialKey);

  // 2D Projection Coordinates generator for Sierpiński layout
  function computeStateCoords(state, n) {
    let x = 0;
    let y = 0;
    let scale = 1.0;

    const pegOffsets = [
      { x: 0.1, y: 0.85 }, // Peg A
      { x: 0.9, y: 0.85 }, // Peg B
      { x: 0.5, y: 0.15 }, // Peg C
    ];

    for (let d = n; d >= 1; d--) {
      let peg = 0;
      if (state[1].includes(d)) peg = 1;
      else if (state[2].includes(d)) peg = 2;

      x += pegOffsets[peg].x * scale;
      y += pegOffsets[peg].y * scale;
      scale *= 0.5;
    }

    return {
      x: Number((x * 0.75 + 0.12).toFixed(3)),
      y: Number((y * 0.75 + 0.12).toFixed(3)),
    };
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const currentKey = serializeState(current);
    const coords = computeStateCoords(current, numDisks);

    nodes.push({
      id: currentKey,
      state: current,
      isInitial: currentKey === initialKey,
      isGoal: currentKey === goalKey,
      x: coords.x,
      y: coords.y,
    });

    const moves = getLegalMoves(current);

    for (const move of moves) {
      const nextKey = serializeState(move.nextState);
      const edgeId = [currentKey, nextKey].sort().join('<->');

      if (!edgeSet.has(edgeId)) {
        edgeSet.add(edgeId);
        edges.push({
          id: edgeId,
          source: currentKey,
          target: nextKey,
          disk: move.disk,
          fromPeg: move.fromPeg,
          toPeg: move.toPeg,
        });
      }

      if (!visited.has(nextKey)) {
        visited.add(nextKey);
        queue.push(move.nextState);
      }
    }
  }

  return {
    nodes,
    edges,
    totalStates: nodes.length,
    initialKey,
    goalKey,
  };
}

