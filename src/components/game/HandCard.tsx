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

interface HandCardProps {
  card: Card;
  index: number;
  selected?: boolean;
  onClick?: () => void;
}

export function HandCard({ card, index, selected, onClick }: HandCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(true);
    onClick?.();
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative rounded-xl border w-28 shrink-0 p-2.5 flex flex-col gap-1.5',
          'transition-all duration-150 cursor-pointer',
          'hover:-translate-y-3',
          selected
            ? 'border-white/70 -translate-y-4 ring-2 ring-white/30 shadow-lg shadow-white/10'
            : 'border-gray-700/60 bg-gray-900/80',
        )}
      >
        {isPokemon(card) && <PokemonHandCard card={card} />}
        {isTrainer(card) && <TrainerHandCard card={card} />}
        {isEnergy(card) && <EnergyHandCard card={card} />}

        {/* Expand hint */}
        <div className="absolute bottom-1.5 right-1.5 text-[8px] text-gray-600">tap</div>
      </div>

      {expanded && (
        <CardDetailModal card={card} onClose={() => setExpanded(false)} />
      )}
    </>
  );
}

function PokemonHandCard({ card }: { card: Pokemon }) {
  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[9px] font-mono text-gray-500">{card.stage}</span>
        <span className="text-[9px] font-mono font-bold text-white">{card.hp} HP</span>
      </div>

      {/* Type + name */}
      <TypeBadge type={card.type} />
      <div className="text-xs font-bold text-white leading-tight">{card.name}</div>

      {/* ALL attacks — small but complete */}
      {card.attacks?.length > 0 && (
        <div className="mt-auto pt-1.5 border-t border-gray-800 space-y-1.5">
          {card.attacks.map((attack, i) => (
            <div key={i}>
              <div className="flex items-center justify-between gap-1">
                {/* Energy cost pips */}
                <div className="flex gap-0.5 shrink-0">
                  {attack.cost?.map((c, j) => <EnergyPip key={j} type={c} size="xs" />)}
                </div>
                <span className="text-[9px] font-mono font-bold text-white">{attack.damage || '—'}</span>
              </div>
              <div className="text-[9px] text-gray-300 font-medium leading-tight">{attack.name}</div>
              {attack.text && (
                <div className="text-[8px] text-gray-500 leading-tight mt-0.5">{attack.text}</div>
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
      {/* Full text, no clamp — just tiny */}
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
