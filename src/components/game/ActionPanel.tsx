'use client';

import { useState } from 'react';
import { GameState, ChoiceRequest } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Sword, Zap, Package, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionPanelProps {
  gameState: GameState;
  onAction: (action: string) => void;
  isLoading: boolean;
}

export function ActionPanel({ gameState, onAction, isLoading }: ActionPanelProps) {
  const [customAction, setCustomAction] = useState('');
  const { awaitingChoice, board } = gameState;
  const isPlayerTurn = board.currentTurn === 'player';
  // Choice buttons are always enabled when waiting for player input (setup, prize picks, etc.)
  const choiceDisabled = isLoading;
  const disabled = isLoading || !isPlayerTurn;

  const handleChoice = (optionId: string, label: string) => {
    onAction(`${awaitingChoice?.type}: ${label} (${optionId})`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim()) {
      onAction(customAction.trim());
      setCustomAction('');
    }
  };

  // Get player's hand attacks if active Pokémon
  const activeAttacks = board.playerActive?.attacks || [];

  return (
    <div className="border-t border-gray-800 bg-black/40 p-3 space-y-3">
      {/* Choice prompt */}
      {awaitingChoice && (
        <div className="rounded-lg border border-yellow-900/60 bg-yellow-950/20 p-3">
          <div className="text-xs text-yellow-400 font-medium mb-2">{awaitingChoice.prompt}</div>
          <div className="flex flex-wrap gap-1.5">
            {awaitingChoice.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleChoice(opt.id, opt.label)}
                disabled={choiceDisabled}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer',
                  'border-yellow-700/60 bg-yellow-900/30 text-yellow-200',
                  'hover:border-yellow-500 hover:bg-yellow-900/50',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {opt.label}
                {opt.description && <span className="text-xs text-yellow-500/70 ml-1">({opt.description})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attack buttons */}
      {!awaitingChoice && activeAttacks.length > 0 && isPlayerTurn && (
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Attacks</div>
          <div className="flex flex-wrap gap-1.5">
            {activeAttacks.map((attack, i) => (
              <button
                key={i}
                onClick={() => onAction(`Use attack: ${attack.name} (${attack.damage || 'no damage'})`)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium',
                  'border-red-800/60 bg-red-950/30 text-red-200',
                  'hover:border-red-600 hover:bg-red-900/40',
                  'transition-all duration-150 cursor-pointer',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <Sword size={12} />
                <span>{attack.name}</span>
                <span className="font-mono text-xs text-red-400">{attack.damage}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick action buttons */}
      {!awaitingChoice && isPlayerTurn && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onAction('Play an energy card from my hand')}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium',
              'border-yellow-900/60 bg-yellow-950/20 text-yellow-300',
              'hover:border-yellow-700 hover:bg-yellow-900/30',
              'transition-all duration-150 cursor-pointer',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <Zap size={12} />
            Attach Energy
          </button>
          <button
            onClick={() => onAction('Play a Trainer card from my hand')}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium',
              'border-blue-900/60 bg-blue-950/20 text-blue-300',
              'hover:border-blue-700 hover:bg-blue-900/30',
              'transition-all duration-150 cursor-pointer',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <Package size={12} />
            Play Trainer
          </button>
          <button
            onClick={() => onAction('End my turn')}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium',
              'border-gray-700 bg-gray-800/50 text-gray-300',
              'hover:border-gray-500 hover:bg-gray-700/50',
              'transition-all duration-150 cursor-pointer',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <SkipForward size={12} />
            End Turn
          </button>
        </div>
      )}

      {/* Custom action input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          placeholder={
            isLoading
              ? 'Processing...'
              : awaitingChoice
                ? "Or type your choice manually..."
                : !isPlayerTurn
                  ? 'Waiting for AI opponent...'
                  : "Type any action... (e.g. 'bench Eevee', 'retreat to Venusaur')"
          }
          disabled={isLoading || (!isPlayerTurn && !awaitingChoice)}
          className={cn(
            'flex-1 bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200',
            'placeholder:text-gray-600',
            'focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        />
        <button
          type="submit"
          disabled={disabled || !customAction.trim()}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 cursor-pointer',
            'bg-red-600 hover:bg-red-500 text-white border border-red-500',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          Send
        </button>
      </form>

      {/* Turn indicator */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="font-mono">Turn {gameState.turnNumber}</span>
        <span className={cn(
          'px-2 py-0.5 rounded font-medium',
          isPlayerTurn ? 'text-emerald-400 bg-emerald-950/30' : 'text-red-400 bg-red-950/30'
        )}>
          {isPlayerTurn ? '● Your Turn' : '● AI Turn'}
        </span>
      </div>
    </div>
  );
}
