'use client';

import type { FurnitureItem } from '@/types';
import { FURNITURE_LIBRARY } from '@/lib/furnitureLibrary';

type FurniturePanelProps = {
  onAdd: (item: FurnitureItem) => void;
};

export default function FurniturePanel({ onAdd }: Readonly<FurniturePanelProps>) {
  return (
    <aside className="absolute left-4 top-20 z-20 w-64 rounded-xl border border-[#355139] bg-black/40 p-3 backdrop-blur-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#a8ef8b]">Furniture</h2>
      <div className="space-y-2">
        {FURNITURE_LIBRARY.map((item) => (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            className="w-full rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-[#1e3224]"
          >
            {item.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
