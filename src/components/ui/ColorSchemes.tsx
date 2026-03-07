'use client';

import { useState } from 'react';
import { COLOR_SCHEMES, type ColorScheme } from '@/lib/colorSchemes';

type ColorSchemesProps = {
  onApplyScheme: (scheme: ColorScheme) => void;
  hasFurniture: boolean;
};

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'organic', label: '🌳 Organic' },
  { key: 'tech', label: '⚡ Tech' },
  { key: 'mixed', label: '🔀 Mixed' },
  { key: 'luminous', label: '✨ Luminous' },
] as const;

export default function ColorSchemes({
  onApplyScheme,
  hasFurniture,
}: Readonly<ColorSchemesProps>) {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'organic' | 'tech' | 'mixed' | 'luminous'
  >('all');

  const filteredSchemes =
    activeCategory === 'all'
      ? COLOR_SCHEMES
      : COLOR_SCHEMES.filter((scheme) => scheme.category === activeCategory);

  return (
    <aside className="absolute left-2 bottom-20 z-20 w-[min(20rem,52vw)] rounded-xl border border-[#355139] bg-black/45 p-3 backdrop-blur-sm sm:left-4 sm:w-80">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#a8ef8b]">
        Color Schemes
      </h2>
      <p className="mb-3 text-xs text-zinc-300">
        Apply coordinated material palettes to all furniture at once.
      </p>

      {!hasFurniture && (
        <div className="mb-3 rounded-lg bg-yellow-900/20 p-2 text-xs text-yellow-200">
          ⚠️ Add furniture first to apply color schemes
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-md px-2 py-1 text-xs ${
              activeCategory === cat.key
                ? 'bg-[#7ddf64] text-[#0f1713]'
                : 'border border-[#314a35] bg-[#16241a] text-zinc-200 hover:bg-[#1e3224]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-h-64 space-y-2 overflow-auto pr-1">
        {filteredSchemes.map((scheme) => (
          <button
            key={scheme.id}
            type="button"
            disabled={!hasFurniture}
            onClick={() => onApplyScheme(scheme)}
            className="w-full rounded-lg border border-[#314a35] bg-[#132019] p-2 text-left transition hover:border-[#7ddf64] hover:bg-[#1b2d23] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Apply ${scheme.name} color scheme`}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{scheme.emoji}</span>
                <span className="text-sm font-semibold text-zinc-100">
                  {scheme.name}
                </span>
              </div>
              <span className="rounded bg-[#314a35] px-1.5 py-0.5 text-[10px] text-zinc-300">
                {scheme.category}
              </span>
            </div>
            <p className="text-xs text-zinc-300">{scheme.description}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
