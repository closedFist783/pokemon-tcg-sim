'use client';

import { Card, Pokemon, TrainerCard, EnergyCard } from '@/types/game';
import { TypeBadge } from './TypeBadge';
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
  return (
    <div
      onClick={onClick}
      style={{ '--hover-translate': '-12px' } as React.CSSProperties}
      className={cn(
        'relative rounded-xl border w-28 shrink-0 p-2.5 flex flex-col gap-1.5',
        'transition-all duration-150 cursor-pointer',
        'hover:-translate-y-3',
        selected ? 'border-white/70 -translate-y-4 ring-2 ring-white/30 shadow-lg shadow-white/10' : 'border-gray-700/60 bg-gray-900/80',
      )}
    >
      {isPokemon(card) && <PokemonHandCard card={card} />}
      {isTrainer(card) && <TrainerHandCard card={card} />}
      {isEnergy(card) && <EnergyHandCard card={card} />}
    </div>
  );
}

function PokemonHandCard({ card }: { card: Pokemon }) {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono text-gray-500">{card.stage}</span>
        <span className="text-[10px] font-mono font-bold text-white">{card.hp} HP</span>
      </div>
      <TypeBadge type={card.type} />
      <div className="text-xs font-bold text-white leading-tight">{card.name}</div>
      {card.attacks[0] && (
        <div className="mt-auto pt-1 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 truncate">{card.attacks[0].name}</span>
            <span className="text-[10px] font-mono text-white ml-1">{card.attacks[0].damage || '—'}</span>
          </div>
        </div>
      )}
    </>
  );
}

function TrainerHandCard({ card }: { card: TrainerCard }) {
  const typeColors = {
    Item: 'border-blue-700/50 bg-blue-950/30',
    Supporter: 'border-orange-700/50 bg-orange-950/30',
    Stadium: 'border-emerald-700/50 bg-emerald-950/30',
    Tool: 'border-purple-700/50 bg-purple-950/30',
  };

  return (
    <>
      <div className={`text-[9px] px-1.5 py-0.5 rounded border font-medium self-start
        ${typeColors[card.cardType]}`}>
        {card.cardType}
      </div>
      <div className="text-xs font-bold text-white leading-tight">{card.name}</div>
      <div className="text-[10px] text-gray-400 leading-tight line-clamp-3 mt-auto">{card.text}</div>
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
