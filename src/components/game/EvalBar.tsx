'use client';

interface EvalBarProps {
  evalScore: number; // -100 to +100
}

export function EvalBar({ evalScore }: EvalBarProps) {
  // Convert eval to percentage (0-100) where 50 = even
  const normalized = (evalScore + 100) / 2; // 0-100
  // Player (green) is at bottom, opponent (red) at top
  // Higher eval = more green at bottom
  const playerHeight = normalized; // % of bar that's green

  const absEval = Math.abs(evalScore);
  const label = absEval < 5 ? '=' : absEval < 20 ? (evalScore > 0 ? '+' : '−') : evalScore > 0 ? '++' : '−−';
  const advantage = evalScore > 10 ? 'Player advantage' : evalScore < -10 ? 'AI advantage' : 'Even';

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Eval</div>
      
      {/* The bar */}
      <div className="relative flex-1 w-6 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
        {/* Opponent side (red, top) */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-red-700 to-red-900 transition-all duration-500"
          style={{ height: `${100 - playerHeight}%` }}
        />
        {/* Player side (green, bottom) */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-700 to-emerald-900 transition-all duration-500"
          style={{ height: `${playerHeight}%` }}
        />
        {/* Center line */}
        <div className="absolute left-0 right-0 h-px bg-gray-600" style={{ top: '50%' }} />
      </div>

      {/* Score display */}
      <div className="text-center">
        <div className="text-xs font-mono font-bold text-white">{label}</div>
        <div className="text-[9px] text-gray-500 font-mono mt-0.5">
          {evalScore > 0 ? '+' : ''}{evalScore}
        </div>
      </div>
    </div>
  );
}

export function MiniEvalBar({ evalScore }: EvalBarProps) {
  const normalized = (evalScore + 100) / 2;
  
  return (
    <div className="flex items-center gap-1">
      <div className="relative h-2 w-24 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
        <div
          className="absolute left-0 top-0 bottom-0 bg-emerald-700 transition-all duration-300"
          style={{ width: `${normalized}%` }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 bg-red-800 transition-all duration-300"
          style={{ width: `${100 - normalized}%` }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600" />
      </div>
      <span className="text-xs font-mono text-gray-400">
        {evalScore > 0 ? '+' : ''}{evalScore}
      </span>
    </div>
  );
}
