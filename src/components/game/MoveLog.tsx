'use client';

import { Move } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface MoveLogProps {
  moves: Move[];
}

export function MoveLog({ moves }: MoveLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves]);

  // Group by turn
  const grouped = moves.reduce<Record<number, Move[]>>((acc, move) => {
    if (!acc[move.turnNumber]) acc[move.turnNumber] = [];
    acc[move.turnNumber].push(move);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono px-2 py-1.5 border-b border-gray-800">
        Move History
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {Object.entries(grouped).map(([turn, turnMoves]) => (
            <div key={turn}>
              {turnMoves.map((move, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-1.5 py-0.5 px-1 rounded text-xs group hover:bg-white/5 transition-colors`}
                >
                  <span className="font-mono text-gray-600 shrink-0 w-8">
                    {i === 0 ? `T${turn}` : ''}
                  </span>
                  <span className={`shrink-0 text-[10px] uppercase tracking-wide font-medium w-5
                    ${move.player === 'player' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {move.player === 'player' ? 'P' : 'AI'}
                  </span>
                  <span className="text-gray-300 flex-1 leading-tight">{move.action}</span>
                  {move.evalAfter !== move.evalBefore && (
                    <span className={`text-[10px] font-mono shrink-0 ${
                      (move.evalAfter - move.evalBefore) > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {move.evalAfter - move.evalBefore > 0 ? '+' : ''}{move.evalAfter - move.evalBefore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
