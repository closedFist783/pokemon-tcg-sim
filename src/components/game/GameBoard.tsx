'use client';

import { GameState } from '@/types/game';
import { PokemonCard, EmptySlot } from './PokemonCard';
import { EvalBar } from './EvalBar';
import { MoveLog } from './MoveLog';
import { GameChat } from './GameChat';
import { ActionPanel } from './ActionPanel';
import { HandCard } from './HandCard';
import { Shield, Archive, Layers } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onAction: (action: string) => void;
  isLoading: boolean;
  conversationHistory: Array<{ role: string; content: string }>;
}

export function GameBoard({ gameState, onAction, isLoading, conversationHistory }: GameBoardProps) {
  const { board } = gameState;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black/60 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-bold text-sm">Pokémon TCG</span>
          <span className="text-gray-600 text-xs font-mono">vs AI</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-gray-500">Turn {gameState.turnNumber}</span>
          <span className={board.currentTurn === 'player' ? 'text-emerald-400' : 'text-red-400'}>
            {board.currentTurn === 'player' ? '● Your Turn' : '● AI Turn'}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Board */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Scrollable board area (opponent + battle zone + player) */}
          <div className="flex-1 overflow-y-auto min-h-0">

          {/* Opponent side */}
          <div className="p-3 border-b border-gray-800/50 bg-red-950/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider">AI Opponent</span>
              <div className="flex items-center gap-3 text-xs text-gray-600 ml-auto">
                <span className="flex items-center gap-1"><Shield size={10} /> {board.opponentPrizes} Prizes</span>
                <span className="flex items-center gap-1"><Layers size={10} /> {board.opponentDeckSize} Deck</span>
                <span className="flex items-center gap-1"><Archive size={10} /> {board.opponentDiscardSize} Discard</span>
              </div>
            </div>
            {/* Opponent bench */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const pkmn = board.opponentBench[i];
                return pkmn
                  ? <PokemonCard key={i} pokemon={pkmn} size="sm" isOpponent />
                  : <EmptySlot key={i} label="Bench" isOpponent />;
              })}
            </div>
            {/* Opponent active */}
            <div className="flex justify-center">
              <div className="w-64">
                {board.opponentActive
                  ? <PokemonCard pokemon={board.opponentActive} size="lg" isOpponent />
                  : <EmptySlot label="No Active Pokémon" isOpponent />
                }
              </div>
            </div>
          </div>

          {/* Battle zone divider */}
          <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-900/30 border-y border-gray-800/30">
            <div className="flex-1 h-px bg-gray-800/60" />
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">Battle Zone</span>
            {board.activeStadium && (
              <span className="text-[10px] text-emerald-600 px-2 py-0.5 rounded border border-emerald-900/50 bg-emerald-950/20">
                {board.activeStadium}
              </span>
            )}
            <div className="flex-1 h-px bg-gray-800/60" />
          </div>

          {/* Player side */}
          <div className="p-3 border-b border-gray-800/50 bg-emerald-950/5">
            {/* Player active */}
            <div className="flex justify-center mb-2">
              <div className="w-64">
                {board.playerActive
                  ? <PokemonCard pokemon={board.playerActive} size="lg" />
                  : <EmptySlot label="No Active Pokémon" />
                }
              </div>
            </div>
            {/* Player bench */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const pkmn = board.playerBench[i];
                return pkmn
                  ? <PokemonCard key={i} pokemon={pkmn} size="sm" />
                  : <EmptySlot key={i} label="Bench" />;
              })}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1 text-emerald-600"><Shield size={10} /> {board.playerPrizes} Prizes</span>
              <span className="flex items-center gap-1"><Layers size={10} /> {board.playerDeckSize} Deck</span>
              <span className="flex items-center gap-1"><Archive size={10} /> {board.playerDiscardSize} Discard</span>
              <span className="ml-auto text-emerald-500 font-mono font-medium">You</span>
            </div>
          </div>

          </div> {/* end scrollable board area */}

          {/* Hand — always pinned above action panel */}
          <div className="flex-none border-b border-gray-800 bg-black/40">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono px-3 pt-2 pb-1">
              Your Hand ({board.playerHand.length} cards)
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 px-3 pb-3 pt-1">
                {board.playerHand.length === 0 ? (
                  <span className="text-xs text-gray-600 py-4 px-2">No cards in hand</span>
                ) : (
                  board.playerHand.map((card, i) => (
                    <HandCard
                      key={card.id || i}
                      card={card}
                      index={i}
                      onClick={() => onAction(`Select card from hand: ${card.name}`)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action panel — always visible at bottom */}
          <div className="flex-none">
            <ActionPanel gameState={gameState} onAction={onAction} isLoading={isLoading} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 shrink-0 border-l border-gray-800 flex flex-col bg-black/20 overflow-hidden">
          {/* Eval bar */}
          <div className="p-3 border-b border-gray-800 flex justify-center" style={{ height: '160px' }}>
            <EvalBar evalScore={gameState.currentEval} />
          </div>

          {/* Game chat */}
          <div className="flex-1 overflow-hidden flex flex-col border-b border-gray-800">
            <GameChat messages={gameState.messages} isLoading={isLoading} />
          </div>

          {/* Move log */}
          <div className="h-48 overflow-hidden flex flex-col">
            <MoveLog moves={gameState.moveLog} />
          </div>
        </div>
      </div>
    </div>
  );
}
