import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090d16',
};

export const metadata = {
  title: 'ZenithHanoi | AI Planner & State Space Search',
  description: 'Tower of Hanoi AI Planner and State Space Search simulator. Animate legal disk transfers, count moves, and explore A* search, BFS, DFS, and goal-decomposition planning.',
  keywords: [
    'Tower of Hanoi',
    'AI Planner',
    'State Space Search',
    'A* Search',
    'Heuristic Search',
    'BFS',
    'DFS',
    'Move Counter',
    'Sierpiński Graph',
    'Next.js',
    'Tailwind CSS'
  ],
  authors: [{ name: 'ZenithHanoi AI Lab' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔺</text></svg>" />
      </head>
      <body 
        className="antialiased min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
