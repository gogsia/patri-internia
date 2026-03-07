'use client';

import Image from 'next/image';
import { LAYOUT_TEMPLATES } from '@/lib/layoutTemplates';
import type { LayoutTemplate, TemplateCategory } from '@/types';
import type { CustomTemplate } from '@/hooks/useCustomTemplates';
import { useState } from 'react';

type LayoutTemplatesProps = {
  suggestedTemplateIds?: string[];
  customTemplates?: CustomTemplate[];
  onApplyTemplate: (template: LayoutTemplate | CustomTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onAutoArrange: () => void;
  onRemix: () => void;
  hasFurniture: boolean;
};

const CATEGORIES: Array<{ key: 'all' | TemplateCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'minimalist', label: 'Minimalist' },
  { key: 'maximalist', label: 'Maximalist' },
  { key: 'eclectic', label: 'Eclectic' },
];

const CATEGORY_STYLES: Record<TemplateCategory, string> = {
  minimalist: 'from-[#1c2f27] to-[#2c4a39]',
  maximalist: 'from-[#334a21] to-[#654f1f]',
  eclectic: 'from-[#2d2b55] to-[#314e56]',
};

export default function LayoutTemplates({
  suggestedTemplateIds = [],
  customTemplates = [],
  onApplyTemplate,
  onDeleteTemplate,
  onAutoArrange,
  onRemix,
  hasFurniture,
}: Readonly<LayoutTemplatesProps>) {
  const [activeCategory, setActiveCategory] = useState<
    'all' | TemplateCategory | 'custom'
  >('all');

  const filteredBuiltInTemplates =
    activeCategory === 'all' || activeCategory === 'custom'
      ? LAYOUT_TEMPLATES
      : LAYOUT_TEMPLATES.filter(
          (template) => template.category === activeCategory
        );

  const filteredCustomTemplates =
    activeCategory === 'custom' ? customTemplates : [];

  const showCustomTab = customTemplates.length > 0;

  return (
    <aside className="absolute right-2 top-90 z-20 w-[min(20rem,52vw)] rounded-xl border border-[#355139] bg-black/45 p-3 backdrop-blur-sm sm:right-4 sm:w-80">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#a8ef8b]">
        Templates
      </h2>
      <p className="mb-3 text-xs text-zinc-300">
        One-click starter layouts with style-aware suggestions.
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hasFurniture}
          onClick={onAutoArrange}
          className="rounded-md border border-[#314a35] bg-[#16241a] px-2 py-1 text-xs text-zinc-200 hover:bg-[#1e3224] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Auto arrange current furniture"
        >
          Auto Arrange
        </button>
        <button
          type="button"
          disabled={!hasFurniture}
          onClick={onRemix}
          className="rounded-md border border-[#314a35] bg-[#16241a] px-2 py-1 text-xs text-zinc-200 hover:bg-[#1e3224] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Remix current furniture"
        >
          Remix
        </button>
      </div>

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
        {showCustomTab && (
          <button
            type="button"
            onClick={() => setActiveCategory('custom')}
            className={`rounded-md px-2 py-1 text-xs ${
              activeCategory === 'custom'
                ? 'bg-[#7ddf64] text-[#0f1713]'
                : 'border border-[#314a35] bg-[#16241a] text-zinc-200 hover:bg-[#1e3224]'
            }`}
          >
            💾 Custom ({customTemplates.length})
          </button>
        )}
      </div>

      <div className="max-h-64 space-y-2 overflow-auto pr-1">
        {/* Show custom templates or built-in templates */}
        {activeCategory === 'custom' && filteredCustomTemplates.length > 0 ? (
          filteredCustomTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onApplyTemplate(template)}
              className="group relative w-full rounded-lg border border-[#314a35] bg-[#132019] p-2 text-left transition hover:border-[#7ddf64] hover:bg-[#1b2d23]"
              aria-label={`Apply ${template.name} template`}
            >
              <div className="relative mb-2 h-10 overflow-hidden rounded-md">
                <div className="h-full w-full bg-gradient-to-r from-[#1f4a2d] to-[#2d1f4a]" />
              </div>
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-zinc-100">
                    {template.name}
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    {template.category} • {template.furniture.length} items
                  </p>
                </div>
                {onDeleteTemplate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(template.id);
                    }}
                    className="mt-1 rounded px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-red-900/30 hover:text-red-300 transition"
                    aria-label={`Delete ${template.name} template`}
                  >
                    ✕
                  </button>
                )}
              </div>
              {template.description && (
                <p className="text-xs text-zinc-300">{template.description}</p>
              )}
            </button>
          ))
        ) : activeCategory === 'custom' ? (
          <div className="p-4 text-center text-xs text-zinc-400">
            No custom templates saved yet.
          </div>
        ) : (
          filteredBuiltInTemplates.map((template) => {
            const isSuggested = suggestedTemplateIds.includes(template.id);
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onApplyTemplate(template)}
                className="w-full rounded-lg border border-[#314a35] bg-[#132019] p-2 text-left transition hover:border-[#7ddf64] hover:bg-[#1b2d23]"
                aria-label={`Apply ${template.name} template`}
              >
                <div className="relative mb-2 h-10 overflow-hidden rounded-md">
                  {template.previewImage ? (
                    <Image
                      src={template.previewImage}
                      alt={`${template.name} preview`}
                      fill
                      sizes="320px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`h-full w-full bg-linear-to-r ${CATEGORY_STYLES[template.category]}`}
                    />
                  )}
                </div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-zinc-100">
                    {template.name}
                  </span>
                  {isSuggested ? (
                    <span className="rounded bg-[#7ddf64]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#a8ef8b]">
                      Suggested
                    </span>
                  ) : null}
                </div>
                <p className="mb-1 text-xs text-zinc-300">
                  {template.description}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {template.category} • {template.furniture.length} items
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
