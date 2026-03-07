'use client';

import { SOLARPUNK_MATERIALS, type MaterialDefinition } from '@/lib/materials';
import { useState } from 'react';

type MaterialPickerProps = {
  currentMaterial?: string;
  onMaterialSelect: (materialName: string) => void;
  onClose: () => void;
};

export default function MaterialPicker({
  currentMaterial,
  onMaterialSelect,
  onClose,
}: Readonly<MaterialPickerProps>) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'organic' | 'tech' | 'hybrid' | 'luminous'
  >('all');

  const categories = [
    { id: 'all' as const, label: 'All', emoji: '🎨' },
    { id: 'organic' as const, label: 'Organic', emoji: '🌱' },
    { id: 'tech' as const, label: 'Tech', emoji: '⚡' },
    { id: 'hybrid' as const, label: 'Hybrid', emoji: '🔀' },
    { id: 'luminous' as const, label: 'Luminous', emoji: '✨' },
  ];

  // Filter materials by category
  const filteredMaterials =
    selectedCategory === 'all'
      ? Object.values(SOLARPUNK_MATERIALS)
      : Object.values(SOLARPUNK_MATERIALS).filter(
          (mat) => mat.category === selectedCategory
        );

  // Get color preview from material
  const getColorPreview = (material: MaterialDefinition) => {
    const color = material.material.color.getHexString();
    const emissive = material.material.emissive?.getHexString() || '000000';
    const hasEmissive =
      material.material.emissiveIntensity &&
      material.material.emissiveIntensity > 0;

    if (hasEmissive) {
      return `linear-gradient(135deg, #${color} 0%, #${emissive} 100%)`;
    }
    return `#${color}`;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-gray-900/95 via-emerald-950/95 to-gray-900/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-900/20 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-100">
              🎨 Material Picker
            </h2>
            <p className="text-sm text-emerald-300/70">
              Choose a solarpunk material
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-emerald-300 transition-colors hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-emerald-500/20 bg-black/20 px-6 py-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <span className="mr-2">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Material Grid */}
        <div className="max-h-[500px] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filteredMaterials.map((mat) => {
              const isSelected = currentMaterial === mat.name;
              return (
                <button
                  key={mat.name}
                  type="button"
                  onClick={() => {
                    onMaterialSelect(mat.name);
                    onClose();
                  }}
                  className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:scale-105 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/50'
                      : 'border-emerald-500/20 bg-black/20 hover:border-emerald-400/50 hover:bg-emerald-500/10'
                  }`}
                >
                  {/* Color Preview */}
                  <div
                    className="mb-3 h-16 w-full rounded-md border border-white/10 shadow-inner"
                    style={{
                      background: getColorPreview(mat),
                    }}
                  />

                  {/* Material Name */}
                  <div className="mb-1 text-sm font-bold text-emerald-100">
                    {mat.displayName}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-emerald-300/60">
                    {mat.description}
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
                      ✓
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute left-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-emerald-300">
                    {mat.category}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="py-12 text-center text-emerald-300/50">
              No materials in this category
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-500/20 bg-black/20 px-6 py-3 text-center text-xs text-emerald-300/50">
          {filteredMaterials.length} material
          {filteredMaterials.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
}
