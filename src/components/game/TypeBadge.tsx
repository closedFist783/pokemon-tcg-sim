import { CardType } from '@/types/game';

const typeColors: Record<CardType, { bg: string; text: string; border: string }> = {
  Fire: { bg: 'bg-red-900/60', text: 'text-red-300', border: 'border-red-700' },
  Water: { bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-700' },
  Grass: { bg: 'bg-green-900/60', text: 'text-green-300', border: 'border-green-700' },
  Lightning: { bg: 'bg-yellow-900/60', text: 'text-yellow-300', border: 'border-yellow-700' },
  Psychic: { bg: 'bg-purple-900/60', text: 'text-purple-300', border: 'border-purple-700' },
  Fighting: { bg: 'bg-orange-900/60', text: 'text-orange-300', border: 'border-orange-700' },
  Darkness: { bg: 'bg-gray-900/80', text: 'text-gray-300', border: 'border-gray-600' },
  Metal: { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-500' },
  Dragon: { bg: 'bg-indigo-900/60', text: 'text-indigo-300', border: 'border-indigo-700' },
  Fairy: { bg: 'bg-pink-900/60', text: 'text-pink-300', border: 'border-pink-700' },
  Colorless: { bg: 'bg-stone-800/60', text: 'text-stone-300', border: 'border-stone-600' },
  Normal: { bg: 'bg-stone-800/60', text: 'text-stone-300', border: 'border-stone-600' },
};

const typeIcons: Record<CardType, string> = {
  Fire: '🔥',
  Water: '💧',
  Grass: '🌿',
  Lightning: '⚡',
  Psychic: '🔮',
  Fighting: '🥊',
  Darkness: '🌑',
  Metal: '⚙️',
  Dragon: '🐉',
  Fairy: '✨',
  Colorless: '⭕',
  Normal: '⭕',
};

interface TypeBadgeProps {
  type: CardType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const colors = typeColors[type] || typeColors.Colorless;
  const icon = typeIcons[type] || '⭕';
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 border text-xs font-mono font-medium
        ${colors.bg} ${colors.text} ${colors.border}
        ${size === 'md' ? 'px-2 py-1 text-sm' : ''}`}
    >
      <span className="text-xs">{icon}</span>
      {type}
    </span>
  );
}

export function EnergyCost({ cost }: { cost: CardType[] }) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {cost.map((type, i) => {
        const colors = typeColors[type] || typeColors.Colorless;
        return (
          <span
            key={i}
            title={type}
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs
              ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {typeIcons[type]?.charAt(0) || '?'}
          </span>
        );
      })}
    </div>
  );
}

export function EnergyPip({ type }: { type: CardType }) {
  const colors = typeColors[type] || typeColors.Colorless;
  return (
    <span
      title={`${type} Energy`}
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px]
        ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {typeIcons[type]?.charAt(0) || '?'}
    </span>
  );
}
