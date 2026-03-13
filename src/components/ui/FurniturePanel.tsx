'use client';

import type { FurnitureItem } from '@/types';
import { FURNITURE_LIBRARY } from '@/lib/furnitureLibrary';

type FurniturePanelProps = {
  onAdd: (item: FurnitureItem) => void;
};

function cleanName(name: string) {
  return name.replace(/^[^a-zA-Z0-9]+\s*/, '');
}

function categoryFor(item: FurnitureItem) {
  const type = item.type ?? 'default';
  if (type === 'lamp' || type === 'panel') return 'Lighting/Tech';
  if (type === 'chair' || type === 'sofa' || type === 'bed') return 'Seating';
  if (type === 'table' || type === 'desk' || type === 'bookshelf')
    return 'Functional';
  if (type === 'plant' || type === 'tower' || type === 'vase') return 'Organic';
  if (type === 'rug' || type === 'curtain' || type === 'mirror') return 'Decor';
  return 'Furniture';
}

function FurnitureIcon({ type }: Readonly<{ type?: FurnitureItem['type'] }>) {
  const key = type ?? 'default';

  if (key === 'chair' || key === 'sofa' || key === 'bed') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M4 13h16v5H4z" />
        <path d="M6 13V9h12v4" />
      </svg>
    );
  }

  if (key === 'table' || key === 'desk' || key === 'bookshelf') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M4 8h16v3H4z" />
        <path d="M6 11v7M18 11v7" />
      </svg>
    );
  }

  if (key === 'lamp' || key === 'panel') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M7 10h10l-2 4H9z" />
        <path d="M12 14v5M9 19h6" />
      </svg>
    );
  }

  if (key === 'plant' || key === 'tower' || key === 'vase') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M8 18h8l-1 3H9z" />
        <path d="M12 18v-8" />
        <path d="M12 10c0-2 2-3 4-3-1 3-3 4-4 4z" />
        <path d="M12 12c0-2-2-3-4-3 1 3 3 4 4 4z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

export default function FurniturePanel({
  onAdd,
}: Readonly<FurniturePanelProps>) {
  return (
    <aside className="absolute left-2 top-20 z-20 w-[min(18rem,48vw)] rounded-xl border border-[#355139] bg-black/45 p-3 backdrop-blur-sm sm:left-4 sm:w-72">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#a8ef8b]">
        Furniture Library
      </h2>
      <p className="mb-3 text-[11px] text-zinc-400">
        Tap to place an object in the scene
      </p>
      <div className="grid grid-cols-1 gap-2">
        {FURNITURE_LIBRARY.map((item) => (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            aria-label={`Add ${cleanName(item.name)}`}
            className="w-full rounded-lg border border-[#314a35] bg-[#16241a] px-3 py-2 text-left text-sm text-zinc-100 transition hover:border-[#4f7b58] hover:bg-[#1e3224]"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#3e5d45] bg-[#203126] text-[#a8ef8b]">
                <FurnitureIcon type={item.type} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {cleanName(item.name)}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                  {categoryFor(item)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
