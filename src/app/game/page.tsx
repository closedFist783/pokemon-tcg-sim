'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameState, Move } from '@/types/game';
import { GameBoard } from '@/components/game/GameBoard';
import { nanoid } from 'nanoid';
import { Loader2, Zap } from 'lucide-react';

export default function GamePage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);

  const startGame = useCallback(async () => {
    setInitializing(true);
    setError(null);
    try {
      const res = await fetch('/api/game/start', { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to start game');
      }
      const data = await res.json();
      
      // Initialize conversation history with the first AI response
      setConversationHistory([
        {
          role: 'assistant',
          content: data.narrative || 'Game started!',
        },
      ]);

      setGameState(data.initialState);
    } catch (e) {
      setError(String(e));
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  // Save game state to localStorage
  useEffect(() => {
    if (gameState) {
      localStorage.setItem('pokemon-tcg-game', JSON.stringify(gameState));
      localStorage.setItem('pokemon-tcg-history', JSON.stringify(conversationHistory));
    }
  }, [gameState, conversationHistory]);

  const handleAction = useCallback(async (action: string) => {
    if (!gameState || isLoading) return;
    
    setIsLoading(true);

    // Add player message to UI immediately
    const playerMessage = {
      id: nanoid(),
      role: 'player' as const,
      content: action,
      timestamp: Date.now(),
    };

    setGameState(prev => prev ? {
      ...prev,
      messages: [...prev.messages, playerMessage],
    } : null);

    try {
      const res = await fetch('/api/game/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          gameState,
          conversationHistory,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to process action');
      }

      const data = await res.json();

      // Update conversation history
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: `Player action: ${action}\n\nCurrent SKIP state:\n${gameState.skipData || ''}` },
        { role: 'assistant', content: data.assistantMessage || data.narrative },
      ];
      setConversationHistory(newHistory);

      // Build the new move log entry
      const newMove: Move = {
        turnNumber: gameState.board.turnNumber,
        player: gameState.board.currentTurn,
        action: data.moveDescription || action,
        evalBefore: gameState.currentEval,
        evalAfter: data.evalScore,
      };

      // Add AI narrative message
      const aiMessage = {
        id: nanoid(),
        role: 'ai' as const,
        content: data.narrative,
        timestamp: Date.now(),
      };

      setGameState(prev => {
        if (!prev) return null;
        const updated: GameState = {
          ...prev,
          board: data.boardState || prev.board,
          currentEval: data.evalScore ?? prev.currentEval,
          evalHistory: [...prev.evalHistory, data.evalScore ?? prev.currentEval],
          moveLog: [...prev.moveLog, newMove],
          messages: [...prev.messages.filter(m => m.id !== playerMessage.id), playerMessage, aiMessage],
          awaitingChoice: data.awaitingChoice || null,
          winner: data.winner || null,
          phase: data.gameOver ? 'ended' : 'playing',
          skipData: data.skipData || prev.skipData,
          turnNumber: data.boardState?.turnNumber || prev.turnNumber,
        };
        return updated;
      });

      // If game is over, redirect to review after short delay
      if (data.gameOver) {
        setTimeout(() => {
          router.push('/review');
        }, 2000);
      }
    } catch (e) {
      console.error('Action error:', e);
      const errorMessage = {
        id: nanoid(),
        role: 'system' as const,
        content: `Error: ${String(e)}. Please try again.`,
        timestamp: Date.now(),
      };
      setGameState(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessage],
      } : null);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, isLoading, conversationHistory, router]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap className="text-yellow-500 animate-pulse" size={32} />
            <span className="text-2xl font-bold text-white">Starting Game...</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm">Claude is generating your decks and setting up the game</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 text-lg font-bold">Failed to start game</div>
          <div className="text-gray-400 text-sm">{error}</div>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  // Game over screen overlay
  if (gameState.phase === 'ended') {
    return (
      <div className="relative">
        <GameBoard
          gameState={gameState}
          onAction={handleAction}
          isLoading={isLoading}
          conversationHistory={conversationHistory}
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold">
              {gameState.winner === 'player' ? (
                <span className="text-yellow-400">Victory!</span>
              ) : (
                <span className="text-red-400">Defeat</span>
              )}
            </div>
            <div className="text-gray-400">Redirecting to review...</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/review')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium cursor-pointer transition-colors"
              >
                View Review Now
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium cursor-pointer transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameBoard
      gameState={gameState}
      onAction={handleAction}
      isLoading={isLoading}
      conversationHistory={conversationHistory}
    />
  );
}
