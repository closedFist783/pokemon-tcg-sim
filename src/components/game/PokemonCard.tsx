'use client';

import { useState } from 'react';
import { Pokemon, SpecialCondition } from '@/types/game';
import { TypeBadge, EnergyPip } from './TypeBadge';
import { CardDetailModal } from './CardDetailModal';
import { cn } from '@/lib/utils';

const conditionColors: Record<SpecialCondition, string> = {
  Poisoned: 'bg-purple-900 text-purple-300 border-purple-700',
  Burned: 'bg-orange-900 text-orange-300 border-orange-700',
  Asleep: 'bg-blue-900 text-blue-300 border-blue-700',
  Confused: 'bg-pink-900 text-pink-300 border-pink-700',
  Paralyzed: 'bg-yellow-900 text-yellow-300 border-yellow-700',
};

interface PokemonCardProps {
  pokemon: Pokemon;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  isOpponent?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function PokemonCard({
  pokemon,
  size = 'md',
  isActive = false,
  isOpponent = false,
  onClick,
  selected,
}: PokemonCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(true);
    onClick?.();
  };

  // Safe defaults — AI may omit some fields
  const currentHp = pokemon.currentHp ?? pokemon.hp;
  const hp = pokemon.hp ?? 0;
  const hpPercent = hp > 0 ? (currentHp / hp) * 100 : 100;
  const hpColor =
    hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';
  const isKO = currentHp <= 0;
  const energyAttached = pokemon.energyAttached ?? [];
  const specialConditions = pokemon.specialConditions ?? [];
  const attacks = pokemon.attacks ?? [];

  const modal = expanded && (
    <CardDetailModal card={pokemon} onClose={() => setExpanded(false)} />
  );

  /* ── Small (bench slot) ─────────────────────────────────── */
  if (size === 'sm') {
    return (
      <>
        <div
          onClick={handleClick}
          className={cn(
            'relative rounded-lg border p-2 flex flex-col gap-1 transition-all duration-150 cursor-pointer',
            isOpponent
              ? 'border-red-900/50 bg-red-950/20 hover:border-red-700/60'
              : 'border-emerald-900/50 bg-emerald-950/20 hover:border-emerald-700/60',
            selected && 'border-white/70 ring-1 ring-white/30',
            isKO && 'opacity-40',
          )}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-white truncate">{pokemon.name}</span>
            <span className="text-xs font-mono text-gray-400">
              {currentHp}/{hp}
            </span>
          </div>
          {/* HP bar */}
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${hpColor}`}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>
          {/* Energy pips */}
          {energyAttached.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {energyAttached.map((e, i) => (
                <EnergyPip key={i} type={e} />
              ))}
            </div>
          )}
          {/* Conditions */}
          {specialConditions.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {specialConditions.map((c) => (
                <span
                  key={c}
                  className={`text-[9px] px-1 rounded border ${conditionColors[c]}`}
                >
                  {c.slice(0, 3)}
                </span>
              ))}
            </div>
          )}
          {/* All attacks (compact) */}
          {attacks.length > 0 && (
            <div className="pt-1 border-t border-gray-800/60 space-y-0.5">
              {attacks.map((attack, i) => (
                <div key={i} className="flex items-center justify-between gap-1">
                  <span className="text-[9px] text-gray-400 truncate">{attack.name}</span>
                  <span className="text-[9px] font-mono text-white shrink-0">
                    {attack.damage || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {modal}
      </>
    );
  }

  /* ── Large (active Pokémon) ─────────────────────────────── */
  if (size === 'lg') {
    return (
      <>
        <div
          onClick={handleClick}
          className={cn(
            'relative rounded-xl border p-4 flex flex-col gap-3 transition-all duration-150 cursor-pointer',
            isOpponent
              ? 'border-red-800/60 bg-gradient-to-b from-red-950/30 to-black hover:border-red-600/70'
              : 'border-emerald-800/60 bg-gradient-to-b from-emerald-950/30 to-black hover:border-emerald-600/70',
            selected && 'border-white/70 ring-2 ring-white/20',
            isKO && 'opacity-40',
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{pokemon.name}</span>
                {pokemon.isEX && (
                  <span className="text-xs bg-yellow-900/60 text-yellow-300 border border-yellow-700 px-1.5 rounded">
                    EX
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <TypeBadge type={pokemon.type} />
                <span className="text-xs text-gray-500 font-mono">{pokemon.stage}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white">{currentHp}</div>
              <div className="text-xs text-gray-500 font-mono">/{hp} HP</div>
            </div>
          </div>

          {/* HP bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${hpColor}`}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>

          {/* Energy */}
          {energyAttached.length > 0 && (
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Energy</div>
              <div className="flex flex-wrap gap-1">
                {energyAttached.map((e, i) => (
                  <EnergyPip key={i} type={e} />
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          {specialConditions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {specialConditions.map((c) => (
                <span
                  key={c}
                  className={`text-xs px-2 py-0.5 rounded border ${conditionColors[c]}`}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* All attacks */}
          {attacks.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Attacks</div>
              {attacks.map((attack, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-medium text-white">{attack.name}</span>
                      <div className="flex gap-0.5">
                        {(attack.cost ?? []).map((c, j) => (
                          <EnergyPip key={j} type={c} />
                        ))}
                      </div>
                    </div>
                    {attack.text && (
                      <div className="text-[11px] text-gray-400 mt-0.5">{attack.text}</div>
                    )}
                  </div>
                  <span className="text-lg font-mono font-bold text-white shrink-0">
                    {attack.damage || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Ability */}
          {pokemon.ability && (
            <div className="border border-purple-900/50 rounded-lg p-2 bg-purple-950/20">
              <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">
                Ability
              </div>
              <div className="text-sm font-medium text-white">{pokemon.ability.name}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{pokemon.ability.text}</div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono border-t border-gray-800 pt-2">
            {pokemon.weakness && (
              <span>
                W: {pokemon.weakness.type} {pokemon.weakness.multiplier}
              </span>
            )}
            {pokemon.resistance && (
              <span>
                R: {pokemon.resistance.type} {pokemon.resistance.modifier}
              </span>
            )}
            <span>Retreat: {pokemon.retreatCost ?? 0}</span>
            {(pokemon.damage ?? 0) > 0 && (
              <span className="text-red-400 ml-auto">{pokemon.damage} dmg</span>
            )}
          </div>
        </div>
        {modal}
      </>
    );
  }

  /* ── Medium (default) ───────────────────────────────────── */
  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative rounded-lg border p-3 flex flex-col gap-2 transition-all duration-150 cursor-pointer',
          isOpponent
            ? 'border-red-900/50 bg-red-950/20 hover:border-red-700/60'
            : 'border-emerald-900/50 bg-emerald-950/20 hover:border-emerald-700/60',
          selected && 'border-white/70 ring-1 ring-white/30',
          isKO && 'opacity-40',
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <div>
            <span className="text-sm font-bold text-white block">{pokemon.name}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <TypeBadge type={pokemon.type} />
              <span className="text-[10px] text-gray-500 font-mono">{pokemon.stage}</span>
            </div>
          </div>
          <span className="text-base font-mono font-bold text-white shrink-0">
            {currentHp}
            <span className="text-xs text-gray-500">/{hp}</span>
          </span>
        </div>

        {/* HP bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${hpColor}`}
            style={{ width: `${Math.max(0, hpPercent)}%` }}
          />
        </div>

        {/* Energy */}
        {energyAttached.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {energyAttached.map((e, i) => (
              <EnergyPip key={i} type={e} />
            ))}
          </div>
        )}

        {/* Conditions */}
        {specialConditions.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {specialConditions.map((c) => (
              <span key={c} className={`text-[9px] px-1 py-0.5 rounded border ${conditionColors[c]}`}>
                {c}
              </span>
            ))}
          </div>
        )}

        {/* All attacks */}
        {attacks.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-gray-800/60">
            {attacks.map((attack, i) => (
              <div key={i}>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {(attack.cost ?? []).map((c, j) => (
                        <EnergyPip key={j} type={c} size="xs" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium">{attack.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white shrink-0">
                    {attack.damage || '—'}
                  </span>
                </div>
                {attack.text && (
                  <div className="text-[9px] text-gray-500 leading-tight mt-0.5 pl-1">
                    {attack.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {modal}
    </>
  );
}

export function EmptySlot({
  label,
  isOpponent,
}: {
  label: string;
  isOpponent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed p-3 flex items-center justify-center min-h-[80px]
        ${isOpponent ? 'border-red-900/30 text-red-900/50' : 'border-gray-800 text-gray-700'}`}
    >
      <span className="text-xs">{label}</span>
    </div>
  );
}
