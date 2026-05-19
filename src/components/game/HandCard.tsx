'use client';

import { useState } from 'react';
import { Card, Pokemon, TrainerCard, EnergyCard } from '@/types/game';
import { TypeBadge, EnergyPip } from './TypeBadge';
import { CardDetailModal } from './CardDetailModal';
import { cn } from '@/lib/utils';

function isPokemon(card: Card): card is Pokemon {
  return 'hp' in card;
}
function isTrainer(card: Card): card is TrainerCard {
  return 'cardType' in card;
}
function isEnergy(card: Card): card is EnergyCard {
  return 'isSpecial' in card;
}

function actionLabel(card: Card): string {
  if (isPokemon(card)) return 'Select';
  if (isTrainer(card)) return 'Use';
  return 'Attach';
}

interface HandCardProps {
  card: Card;
  index: number;
  selected?: boolean;
  onClick?: () => void; // actual game action (select/use/attach)
}

export function HandCard({ card, index, selected, onClick }: HandCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className={cn(
          'group relative rounded-xl border w-28 shrink-0 p-2.5 flex flex-col gap-1.5',
          'transition-all duration-150',
          'hover:-translate-y-3',
          selected
            ? 'border-white/70 -translate-y-4 ring-2 ring-white/30 shadow-lg shadow-white/10'
            : 'border-gray-700/60 bg-gray-900/80',
        )}
      >
        {/* Card content — click to expand detail modal */}
        <div
          onClick={() => setExpanded(true)}
          className="cursor-pointer flex flex-col gap-1.5 flex-1"
        >
          {isPokemon(card) && <PokemonHandCard card={card} />}
          {isTrainer(card) && <TrainerHandCard card={card} />}
          {isEnergy(card) && <EnergyHandCard card={card} />}
        </div>

        {/* Hover action overlay — appears above the card on hover */}
        {onClick && (
          <div
            className={cn(
              'absolute -top-9 left-1/2 -translate-x-1/2 z-20',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto',
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap',
                'transition-all duration-150 cursor-pointer shadow-lg shadow-black/50',
                isPokemon(card)
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500'
                  : isTrainer(card)
                  ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-500',
              )}
            >
              {actionLabel(card)}
            </button>
            {/* Arrow pointing down to card */}
            <div className="w-2 h-2 mx-auto -mt-px rotate-45 border-b border-r border-gray-700 bg-gray-900" />
          </div>
        )}
      </div>

      {expanded && (
        <CardDetailModal card={card} onClose={() => setExpanded(false)} />
      )}
    </>
  );
}

function PokemonHandCard({ card }: { card: Pokemon }) {
  const attacks = card.attacks ?? [];
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[9px] font-mono text-gray-500">{card.stage}</span>
        <span className="text-[9px] font-mono font-bold text-white">{card.hp} HP</span>
      </div>
      <TypeBadge type={card.type} />
      <div className="text-xs font-bold text-white leading-tight">{card.name}</div>
      {attacks.length > 0 && (
        <div className="mt-auto pt-1.5 border-t border-gray-800 space-y-1.5">
          {attacks.map((attack, i) => (
            <div key={i}>
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-0.5 shrink-0">
                  {(attack.cost ?? []).map((c, j) => (
                    <EnergyPip key={j} type={c} size="xs" />
                  ))}
                </div>
                <span className="text-[9px] font-mono font-bold text-white">
                  {attack.damage || '—'}
                </span>
              </div>
              <div className="text-[9px] text-gray-300 font-medium leading-tight">
                {attack.name}
              </div>
              {attack.text && (
                <div className="text-[8px] text-gray-500 leading-tight mt-0.5">
                  {attack.text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TrainerHandCard({ card }: { card: TrainerCard }) {
  const typeColors: Record<string, string> = {
    Item: 'border-blue-700/50 bg-blue-950/30 text-blue-300',
    Supporter: 'border-orange-700/50 bg-orange-950/30 text-orange-300',
    Stadium: 'border-emerald-700/50 bg-emerald-950/30 text-emerald-300',
    Tool: 'border-purple-700/50 bg-purple-950/30 text-purple-300',
  };
  return (
    <>
      <div className={cn('text-[9px] px-1.5 py-0.5 rounded border font-medium self-start', typeColors[card.cardType])}>
        {card.cardType}
      </div>
      <div className="text-xs font-bold text-white leading-tight">{card.name}</div>
      <div className="text-[8px] text-gray-400 leading-tight mt-auto">{card.text}</div>
    </>
  );
}

function EnergyHandCard({ card }: { card: EnergyCard }) {
  return (
    <>
      <div className="text-[9px] text-gray-500 font-mono">
        {card.isSpecial ? 'Special' : 'Basic'} Energy
      </div>
      <TypeBadge type={card.type} />
      <div className="text-xs font-bold text-white">{card.name}</div>
    </>
  );
}
