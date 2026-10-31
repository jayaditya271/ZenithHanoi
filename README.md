# 🔺 ZenithHanoi — Tower of Hanoi AI Planner & State Space Search

An interactive, branded, minimalistic website demonstrating the **Tower of Hanoi** problem solved through classical **Artificial Intelligence (AI) State Space Search & Automated Planning**. 

Animates **legal disk transfers**, **counts moves**, and inspects formal AI algorithms including **A* Search**, **Breadth-First Search (BFS)**, **Depth-First Search (DFS)**, **Greedy Best-First Search**, and **Goal-Decomposition AI Planning**.

Built with **Next.js (App Router)**, **Tailwind CSS v4**, and modern **JavaScript**.

---

## 🌟 Key Features

- **Floating Minimalistic Navbar**: Modern floating pill navigation that automatically slides up on scroll down and smoothly reappears on scroll up.
- **Animate Legal Disk Transfers**: Real-time 3-peg board with animated disks, customizable disk counts (3, 4, 5), step-by-step playback, speed controls (`0.5x`, `1x`, `2x`, `4x`), and manual drag/click disk movement with legal move validation.
- **Move Counting & Metrics**:
  - Live Move Counter ($g(n)$).
  - Theoretical Optimal Move Target ($2^N - 1$).
  - Remaining Move Lower Bound ($h(n)$).
  - Search Efficiency and State Expansion stats.
- **Multi-Algorithm AI Solver (`lib/hanoiAIEngine.js`)**:
  - **A* Search**: Guided by $f(n) = g(n) + h(n)$ with an admissible heuristic; guarantees minimal moves.
  - **Breadth-First Search (BFS)**: Complete and optimal for unit step cost.
  - **Depth-First Search (DFS)**: Deep branch exploration with cycle detection.
  - **Greedy Best-First Search**: Guided purely by remaining heuristic distance $h(n)$.
  - **Goal-Decomposition AI Planner**: Divide-and-conquer sub-goal decomposition.
- **Sierpiński Gasket State Space Graph**: Interactive topological graph mapping all $3^N$ states ($27$ nodes for $N=3$) and $39$ transition edges, highlighting the initial state $S_0$, goal state $S_g$, optimal search path, and live tracking of the current node. Click any node to teleport to that state!
- **Single-File Core AI Engine**: The complete AI state space formulation, heuristic functions, search algorithms, and graph generator are unified in [`lib/hanoiAIEngine.js`](./lib/hanoiAIEngine.js) for clean learning.
- **Accessibility & Polish**: Full `title` tooltips, `cursor-pointer` indicators, responsive layout for all screen sizes and networks, and dark frosted-glass aesthetic.
- **Minimalist Branding**: Custom SVG logo and simple copyright footer.

---

## 🧠 Classical AI Formulation (Russell & Norvig)

### 1. State Space Representation
- **State $S$**: Ordered disk sequences across three pegs `[PegA, PegB, PegC]`.
- **Initial State $S_0$**: All $N$ disks on Peg A in descending size: `[[N..1], [], []]`.
- **Goal State $S_g$**: All $N$ disks on Peg C: `[[], [], [N..1]]`.
- **State Space Size**: $|S| = 3^N$ states ($27$ states for $N=3$, $81$ states for $N=4$).

### 2. Action Model & Legal Preconditions
- **Operator**: $\text{Move}(d, \text{from}, \text{to})$
- **Preconditions**:
  1. $d = \text{top}(\text{from})$ (only the topmost disk may move).
  2. $\text{to}$ is empty **OR** $d < \text{top}(\text{to})$ (a larger disk cannot be placed on a smaller disk).
- **Step Cost**: $c(s, a, s') = 1$ for each legal transfer.

### 3. Admissible Heuristic Function $h(n)$
$$h(n) = \sum_{d \in \text{misplaced}} 2^{d - 1}$$

Because moving any misplaced disk $d$ requires clearing the smaller disks above it, transferring it, and moving them back, it requires at least $2^{d-1}$ moves. Hence:
$$h(n) \le h^*(n), \quad \forall n \in S$$
This satisfies **admissibility** and **consistency**, guaranteeing that **A\*** finds the optimal path of length $2^N - 1$.

---

## 📁 Project Architecture & Conventions

```text
TowerHanoi/
├── app/
│   ├── globals.css              # Tailwind CSS v4 setup & custom dark theme
│   ├── layout.js                # Root layout with SEO metadata and viewport
│   └── page.js                  # Main application orchestrating all components
├── components/
│   ├── AISearchInspector.jsx    # Live g(n), h(n), f(n) and operator metrics
│   ├── EducationalGuide.jsx     # Classical AI theory & search algorithms
│   ├── Footer.jsx               # Branded minimalistic footer with copyright
│   ├── HanoiVisualizer.jsx      # Animated peg board, legal disk moves & counter
│   ├── Navbar.jsx               # Floating navbar (hides on scroll down, reveals on up)
│   └── StateSpaceGraph.jsx      # Sierpiński gasket fractal graph visualizer
├── lib/
│   └── hanoiAIEngine.js         # SINGLE-FILE core AI search & planner engine
├── .gitignore                   # Standard clean gitignore
├── next.config.mjs              # Next.js modern configuration
├── package.json                 # Dependencies and scripts (ES module)
├── postcss.config.mjs           # Tailwind CSS v4 PostCSS plugin configuration
└── README.md                    # Project documentation & reference
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18.0 or newer
- [npm](https://www.npmjs.com/) v9 or newer

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License & Attribution

Designed and developed for Classical Artificial Intelligence & State Space Search coursework.  
&copy; 2026 ZenithHanoi AI Planner. Released under the MIT License.
