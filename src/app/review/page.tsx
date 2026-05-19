'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReviewData, MoveRating, GameState } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Loader2, Trophy, AlertTriangle, Sword, Home, BarChart2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RATING_CONFIG: Record<MoveRating, { label: string; color: string; bg: string; border: string }> = {
  brilliant: { label: 'Brilliant', color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-700' },
  best: { label: 'Best', color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-700' },
  excellent: { label: 'Excellent', color: 'text-teal-400', bg: 'bg-teal-950/40', border: 'border-teal-700' },
  good: { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-700' },
  inaccuracy: { label: 'Inaccuracy', color: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-800' },
  mistake: { label: 'Mistake', color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800' },
  blunder: { label: 'Blunder', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-700' },
  missed_win: { label: 'Missed Win', color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-700' },
};

function AccuracyDisplay({ label, accuracy, isWinner }: { label: string; accuracy: number; isWinner: boolean }) {
  const color = accuracy >= 80 ? 'text-green-400' : accuracy >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className={cn(
      'rounded-xl border p-6 text-center transition-all',
      isWinner ? 'border-yellow-700/60 bg-yellow-950/10' : 'border-gray-800 bg-gray-900/30'
    )}>
      {isWinner && <div className="flex justify-center mb-2"><Trophy size={16} className="text-yellow-400" /></div>}
      <div className={`text-5xl font-mono font-bold ${color}`}>{accuracy}</div>
      <div className="text-gray-500 text-sm mt-1">Accuracy</div>
      <div className="text-white font-medium mt-2">{label}</div>
    </div>
  );
}

function RatingBadge({ rating }: { rating: MoveRating }) {
  const cfg = RATING_CONFIG[rating];
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded border font-medium', cfg.color, cfg.bg, cfg.border)}>
      {cfg.label}
    </span>
  );
}

export default function ReviewPage() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReview = async () => {
      // Load game state from localStorage
      const savedGame = localStorage.getItem('pokemon-tcg-game');
      if (!savedGame) {
        setError('No game data found. Play a game first!');
        setIsLoading(false);
        return;
      }

      let gameState: GameState;
      try {
        gameState = JSON.parse(savedGame);
      } catch {
        setError('Failed to load game data.');
        setIsLoading(false);
        return;
      }

      // Check if we already have a review cached
      const cachedReview = localStorage.getItem(`pokemon-tcg-review-${gameState.gameId}`);
      if (cachedReview) {
        setReviewData(JSON.parse(cachedReview));
        setIsLoading(false);
        return;
      }

      // Generate review
      try {
        const res = await fetch('/api/game/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameState }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to generate review');
        }

        const data = await res.json();
        setReviewData(data);
        localStorage.setItem(`pokemon-tcg-review-${gameState.gameId}`, JSON.stringify(data));
      } catch (e) {
        setError(String(e));
      } finally {
        setIsLoading(false);
      }
    };

    loadReview();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BarChart2 className="text-blue-500 animate-pulse" size={32} />
            <span className="text-2xl font-bold text-white">Analyzing Game...</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm">Claude is reviewing your moves</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="text-yellow-400 mx-auto" size={40} />
          <div className="text-white text-lg font-bold">{error}</div>
          <Link
            href="/game"
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium cursor-pointer transition-colors"
          >
            <Sword size={16} />
            Play a Game
          </Link>
        </div>
      </div>
    );
  }

  if (!reviewData) return null;

  // Prepare eval chart data
  const chartData = reviewData.evalHistory.map((val, i) => ({
    turn: i,
    eval: val,
  }));

  // Count ratings
  const playerMoves = reviewData.moves.filter(m => m.player === 'player');
  const ratingCounts = playerMoves.reduce<Partial<Record<MoveRating, number>>>((acc, m) => {
    acc[m.rating] = (acc[m.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/60 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              <Home size={16} />
            </Link>
            <ChevronRight size={14} className="text-gray-700" />
            <span className="text-white font-bold">Game Review</span>
            {reviewData.winner && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded border font-medium',
                reviewData.winner === 'player'
                  ? 'text-yellow-400 bg-yellow-950/30 border-yellow-800'
                  : 'text-red-400 bg-red-950/30 border-red-800'
              )}>
                {reviewData.winner === 'player' ? 'Victory' : 'Defeat'}
              </span>
            )}
          </div>
          <Link
            href="/game"
            className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
          >
            <Sword size={14} />
            New Game
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Accuracy scores */}
        <div className="grid grid-cols-2 gap-4">
          <AccuracyDisplay
            label="You"
            accuracy={reviewData.playerAccuracy}
            isWinner={reviewData.winner === 'player'}
          />
          <AccuracyDisplay
            label="AI Opponent"
            accuracy={reviewData.opponentAccuracy}
            isWinner={reviewData.winner === 'opponent'}
          />
        </div>

        {/* Eval graph */}
        {chartData.length > 1 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <div className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Evaluation Over Time</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="turn" tick={{ fill: '#6b7280', fontSize: 11 }} label={{ value: 'Turn', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 11 }} />
                  <YAxis domain={[-100, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <ReferenceLine y={0} stroke="#374151" strokeWidth={1.5} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value) => [typeof value === 'number' && value > 0 ? `+${value}` : value, 'Eval']}
                    labelFormatter={(label) => `Turn ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="eval"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Player advantage</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> AI advantage (negative)</span>
            </div>
          </div>
        )}

        {/* Rating distribution */}
        {Object.keys(ratingCounts).length > 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <div className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Your Move Ratings</div>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(ratingCounts) as [MoveRating, number][])
                .sort((a, b) => {
                  const order: MoveRating[] = ['brilliant', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder', 'missed_win'];
                  return order.indexOf(a[0]) - order.indexOf(b[0]);
                })
                .map(([rating, count]) => {
                  const cfg = RATING_CONFIG[rating];
                  return (
                    <div key={rating} className={cn('px-3 py-2 rounded-lg border text-center min-w-[80px]', cfg.bg, cfg.border)}>
                      <div className={`text-xl font-mono font-bold ${cfg.color}`}>{count}</div>
                      <div className={`text-xs ${cfg.color} opacity-80`}>{cfg.label}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Key moments */}
        <div className="grid md:grid-cols-3 gap-4">
          {reviewData.turningPoint && (
            <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-4">
              <div className="text-xs text-blue-400 uppercase tracking-wider mb-2 font-medium">Turning Point</div>
              <div className="text-xs text-gray-400 font-mono mb-1">Turn {reviewData.turningPoint.turn}</div>
              <div className="text-sm text-white">{reviewData.turningPoint.description}</div>
            </div>
          )}
          {reviewData.bestMove && (
            <div className="rounded-xl border border-green-900/50 bg-green-950/20 p-4">
              <div className="text-xs text-green-400 uppercase tracking-wider mb-2 font-medium">Best Move</div>
              <div className="text-xs text-gray-400 font-mono mb-1">Turn {reviewData.bestMove.turn}</div>
              <div className="text-sm font-medium text-white mb-1">{reviewData.bestMove.action}</div>
              <div className="text-xs text-gray-400">{reviewData.bestMove.description}</div>
            </div>
          )}
          {reviewData.worstMove && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
              <div className="text-xs text-red-400 uppercase tracking-wider mb-2 font-medium">Worst Move</div>
              <div className="text-xs text-gray-400 font-mono mb-1">Turn {reviewData.worstMove.turn}</div>
              <div className="text-sm font-medium text-white mb-1">{reviewData.worstMove.action}</div>
              <div className="text-xs text-gray-400">{reviewData.worstMove.description}</div>
            </div>
          )}
        </div>

        {/* Move list */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/20">
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Move by Move</div>
          </div>
          <ScrollArea className="h-96">
            <div className="p-2">
              {reviewData.moves.map((move, i) => {
                const cfg = move.rating ? RATING_CONFIG[move.rating] : null;
                const evalDiff = move.evalAfter - move.evalBefore;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    {/* Turn + player */}
                    <div className="shrink-0 w-12 text-center">
                      <div className="text-xs font-mono text-gray-600">T{move.turnNumber}</div>
                      <div className={`text-[10px] uppercase font-medium ${move.player === 'player' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {move.player === 'player' ? 'You' : 'AI'}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-200 leading-tight">{move.action}</div>
                      {move.comment && (
                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">{move.comment}</div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 shrink-0">
                      {cfg && move.player === 'player' && <RatingBadge rating={move.rating} />}
                      <span className={cn(
                        'text-xs font-mono',
                        evalDiff > 0 ? 'text-emerald-600' : evalDiff < 0 ? 'text-red-600' : 'text-gray-700'
                      )}>
                        {evalDiff > 0 ? '+' : ''}{evalDiff}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Summary */}
        {reviewData.summary && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Game Summary</div>
            <p className="text-gray-300 leading-relaxed">{reviewData.summary}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-4 justify-center pb-8">
          <Link
            href="/game"
            className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            <Sword size={18} />
            Play Again
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors cursor-pointer border border-gray-700"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
