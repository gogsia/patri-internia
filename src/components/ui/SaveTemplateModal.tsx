'use client';

import { useCallback, useState } from 'react';
import type { TemplateCategory } from '@/types';

type SaveTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    description: string,
    category: TemplateCategory
  ) => void;
  furnitureCount: number;
};

const CATEGORIES: Array<{ value: TemplateCategory; label: string }> = [
  { value: 'minimalist', label: '🌿 Minimalist' },
  { value: 'maximalist', label: '🌳 Maximalist' },
  { value: 'eclectic', label: '🌊 Eclectic' },
];

export default function SaveTemplateModal({
  isOpen,
  onClose,
  onSave,
  furnitureCount,
}: Readonly<SaveTemplateModalProps>) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('minimalist');
  const [error, setError] = useState('');

  const handleSave = useCallback(() => {
    setError('');
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }

    onSave(name.trim(), description.trim(), category);
    setName('');
    setDescription('');
    setCategory('minimalist');
  }, [name, description, category, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && name.trim()) {
        handleSave();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [name, handleSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[#355139] bg-black/90 p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-bold text-[#a8ef8b]">
          Save as Template
        </h2>
        <p className="mb-4 text-sm text-zinc-300">
          Create a reusable layout from your current arrangement.
        </p>

        {/* Furniture count info */}
        <div className="mb-4 rounded-lg bg-[#1e3224] p-3 text-xs text-zinc-300">
          📦 {furnitureCount} furniture item{furnitureCount !== 1 ? 's' : ''} •
          Ready to save
        </div>

        {/* Template Name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-200 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. My reading corner"
            className="w-full rounded-md border border-[#314a35] bg-[#0f1713] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#7ddf64] focus:outline-none"
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-200 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your layout..."
            className="w-full rounded-md border border-[#314a35] bg-[#0f1713] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#7ddf64] focus:outline-none"
            rows={3}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-200 mb-1">
            Style Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TemplateCategory)}
            className="w-full rounded-md border border-[#314a35] bg-[#0f1713] px-3 py-2 text-sm text-zinc-100 focus:border-[#7ddf64] focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/20 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-[#1e3224] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 rounded-md bg-[#7ddf64] px-3 py-2 text-sm font-semibold text-[#0f1713] hover:bg-[#a8ef8b] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
