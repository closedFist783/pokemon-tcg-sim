'use client';

import { Card, Pokemon, TrainerCard, EnergyCard, SpecialCondition } from '@/types/game';
import { TypeBadge, EnergyPip } from './TypeBadge';
import { X } from 'lucide-react';
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

const conditionColors: Record<SpecialCondition, string> = {
  Poisoned: 'bg-purple-900 text-purple-300 border-purple-700',
  Burned: 'bg-orange-900 text-orange-300 border-orange-700',
  Asleep: 'bg-blue-900 text-blue-300 border-blue-700',
  Confused: 'bg-pink-900 text-pink-300 border-pink-700',
  Paralyzed: 'bg-yellow-900 text-yellow-300 border-yellow-700',
};

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all duration-150 cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {isPokemon(card) && <PokemonDetail pokemon={card} />}
        {isTrainer(card) && <TrainerDetail card={card} />}
        {isEnergy(card) && <EnergyDetail card={card} />}
      </div>
    </div>
  );
}

function PokemonDetail({ pokemon }: { pokemon: Pokemon }) {
  const hpPercent = (pokemon.currentHp / pokemon.hp) * 100;
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pr-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white">{pokemon.name}</h2>
            {pokemon.isEX && (
              <span className="text-xs bg-yellow-900/60 text-yellow-300 border border-yellow-700 px-1.5 py-0.5 rounded">EX</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <TypeBadge type={pokemon.type} />
            <span className="text-xs text-gray-500 font-mono">{pokemon.stage}</span>

          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl font-mono font-bold text-white leading-none">
            {pokemon.currentHp !== undefined ? pokemon.currentHp : pokemon.hp}
          </div>
          <div className="text-xs text-gray-500 font-mono">/{pokemon.hp} HP</div>
        </div>
      </div>

      {/* HP bar (only if in play) */}
      {pokemon.currentHp !== undefined && pokemon.currentHp !== pokemon.hp && (
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${hpColor}`} style={{ width: `${Math.max(0, hpPercent)}%` }} />
        </div>
      )}

      {/* Energy attached (if in play) */}
      {pokemon.energyAttached?.length > 0 && (
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Energy Attached</div>
          <div className="flex flex-wrap gap-1">
            {pokemon.energyAttached.map((e, i) => <EnergyPip key={i} type={e} />)}
          </div>
        </div>
      )}

      {/* Conditions */}
      {pokemon.specialConditions?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pokemon.specialConditions.map(c => (
            <span key={c} className={`text-xs px-2 py-0.5 rounded border ${conditionColors[c]}`}>{c}</span>
          ))}
        </div>
      )}

      {/* Ability */}
      {pokemon.ability && (
        <div className="rounded-xl border border-purple-800/50 bg-purple-950/20 p-3">
          <div className="text-[10px] text-purple-400 uppercase tracking-wider font-medium mb-1">Ability</div>
          <div className="text-sm font-semibold text-white mb-1">{pokemon.ability.name}</div>
          <div className="text-xs text-gray-300 leading-relaxed">{pokemon.ability.text}</div>
        </div>
      )}

      {/* Attacks */}
      {pokemon.attacks?.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Attacks</div>
          {pokemon.attacks.map((attack, i) => (
            <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{attack.name}</span>
                  <div className="flex gap-0.5">
                    {attack.cost?.map((c, j) => <EnergyPip key={j} type={c} />)}
                  </div>
                </div>
                <span className="text-xl font-mono font-bold text-white shrink-0">{attack.damage || '—'}</span>
              </div>
              {attack.text && (
                <p className="text-xs text-gray-400 leading-relaxed">{attack.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono border-t border-gray-800 pt-3">
        {pokemon.weakness && <span>Weak: {pokemon.weakness.type} ×{pokemon.weakness.multiplier || 2}</span>}
        {pokemon.resistance && <span>Resist: {pokemon.resistance.type}</span>}
        <span>Retreat: {'◆'.repeat(pokemon.retreatCost ?? 0) || 'Free'}</span>
      </div>
    </div>
  );
}

function TrainerDetail({ card }: { card: TrainerCard }) {
  const typeColors = {
    Item: { border: 'border-blue-800/50', bg: 'bg-blue-950/20', text: 'text-blue-400', badge: 'border-blue-700/60 bg-blue-950/40 text-blue-300' },
    Supporter: { border: 'border-orange-800/50', bg: 'bg-orange-950/20', text: 'text-orange-400', badge: 'border-orange-700/60 bg-orange-950/40 text-orange-300' },
    Stadium: { border: 'border-emerald-800/50', bg: 'bg-emerald-950/20', text: 'text-emerald-400', badge: 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300' },
    Tool: { border: 'border-purple-800/50', bg: 'bg-purple-950/20', text: 'text-purple-400', badge: 'border-purple-700/60 bg-purple-950/40 text-purple-300' },
  };
  const colors = typeColors[card.cardType];

  return (
    <div className={cn('p-5 space-y-4', colors.bg)}>
      <div className="pr-6">
        <span className={cn('text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider', colors.badge)}>
          {card.cardType}
        </span>
        <h2 className="text-xl font-bold text-white mt-2">{card.name}</h2>
      </div>
      <div className={cn('rounded-xl border p-3', colors.border)}>
        <p className="text-sm text-gray-200 leading-relaxed">{card.text}</p>
      </div>
    </div>
  );
}

function EnergyDetail({ card }: { card: EnergyCard }) {
  return (
    <div className="p-5 space-y-4">
      <div className="pr-6">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          {card.isSpecial ? 'Special' : 'Basic'} Energy
        </span>
        <h2 className="text-xl font-bold text-white mt-1">{card.name}</h2>
        <div className="mt-2">
          <TypeBadge type={card.type} />
        </div>
      </div>
      {card.isSpecial && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
          <p className="text-sm text-gray-400 leading-relaxed">Special Energy — provides a unique effect when attached. See card for full details.</p>
        </div>
      )}
    </div>
  );
}
