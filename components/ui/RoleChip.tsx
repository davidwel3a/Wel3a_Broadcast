import React from 'react';
import { Check } from 'lucide-react';

interface RoleChipProps {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  selected: boolean;
  onToggle: (id: string) => void;
}

export const RoleChip: React.FC<RoleChipProps> = ({
  id,
  name,
  color,
  memberCount,
  selected,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      role="checkbox"
      aria-checked={selected}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 select-none ${
        selected
          ? 'bg-accent/20 border-accent text-text shadow-sm'
          : 'bg-surface/60 border-border text-text-muted hover:border-text-muted hover:text-text'
      }`}
      style={{
        borderColor: selected ? color || 'var(--color-accent)' : undefined,
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color || 'var(--color-accent)' }}
      />
      <span>{name}</span>
      <span className="text-[11px] opacity-75">({memberCount})</span>
      {selected && <Check size={12} className="text-accent" />}
    </button>
  );
};
