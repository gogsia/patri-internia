'use client';

import { useState } from 'react';
import { useLayouts } from '@/hooks/useLayouts';
import { sceneStore } from '@/lib/sceneStore';
import type { FurnitureItem, RoomLayout } from '@/types';

type LayoutControlsProps = {
  furniture: FurnitureItem[];
  designerModelUrl?: string | null;
  onLoad: (layout: RoomLayout) => void;
  onSaveSuccess?: () => void;
};

export default function LayoutControls({
  furniture,
  designerModelUrl,
  onLoad,
  onSaveSuccess,
}: Readonly<LayoutControlsProps>) {
  const [layoutName, setLayoutName] = useState('');
  const { layouts, save, remove } = useLayouts();

  const handleSave = () => {
    const id = String(Date.now());
    const layout: RoomLayout = {
      id,
      name: layoutName.trim() || `Layout ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
      furniture,
      designerModelUrl: designerModelUrl || undefined,
      lighting: {
        ambientIntensity: (sceneStore.get('ambientIntensity') as number) ?? 0.6,
        pointIntensity: (sceneStore.get('pointLightIntensity') as number) ?? 1.5,
      },
    };

    save(layout);
    setLayoutName('');
    onSaveSuccess?.();
  };

  return (
    <aside className="absolute right-2 top-20 z-20 w-[min(18rem,48vw)] rounded-xl border border-[#355139] bg-black/40 p-3 backdrop-blur-sm sm:right-4 sm:w-72">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#a8ef8b]">
        Layouts
      </h2>

      {designerModelUrl && (
        <div className="mb-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 p-2 text-xs text-emerald-300">
          ✓ Designer model loaded
        </div>
      )}

      <div className="mb-3 flex gap-2">
        <input
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          placeholder="Layout name"
          aria-label="Layout name"
          className="w-full rounded-md border border-[#314a35] bg-[#101913] px-2 py-1 text-sm text-zinc-100 outline-none focus:border-[#7ddf64]"
        />
        <button
          onClick={handleSave}
          aria-label="Save current layout"
          className="rounded-md bg-[#7ddf64] px-3 py-1 text-sm font-semibold text-[#0f1713] hover:brightness-95"
        >
          Save
        </button>
      </div>

      <div className="max-h-52 space-y-2 overflow-auto pr-1">
        {Object.values(layouts).length === 0 ? (
          <p className="text-xs text-zinc-300">No saved layouts yet.</p>
        ) : (
          Object.values(layouts)
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((layout) => (
              <div key={layout.id} className="flex items-center gap-2">
                <button
                  onClick={() => onLoad(layout)}
                  aria-label={`Load layout ${layout.name}`}
                  className="flex-1 rounded-md border border-[#314a35] bg-[#16241a] px-2 py-1 text-left text-xs text-zinc-100 hover:bg-[#1e3224]"
                >
                  {layout.name}
                </button>
                <button
                  onClick={() => remove(layout.id)}
                  aria-label={`Delete layout ${layout.name}`}
                  className="rounded-md border border-[#5d2f2f] bg-[#321717] px-2 py-1 text-xs text-zinc-200 hover:bg-[#4a1f1f]"
                >
                  Del
                </button>
              </div>
            ))
        )}
      </div>
    </aside>
  );
}
