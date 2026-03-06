'use client';

import Scene from '@/components/Scene';
import FurniturePanel from '@/components/ui/FurniturePanel';
import LayoutControls from '@/components/ui/LayoutControls';
import Toolbar from '@/components/ui/Toolbar';
import type { FurnitureItem, RoomLayout } from '@/types';
import { useState } from 'react';

export default function Home() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);

  const handleAddFurniture = (item: FurnitureItem) => {
    const randomX = Math.random() * 6 - 3;
    const randomZ = Math.random() * 6 - 3;
    setFurniture((prev) => [
      ...prev,
      {
        ...item,
        id: `${item.id}-${Date.now()}`,
        position: [randomX, 0.5, randomZ],
        rotation: [0, Math.random() * Math.PI, 0],
      },
    ]);
  };

  const handleLoadLayout = (layout: RoomLayout) => {
    setFurniture(layout.furniture);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111815]">
      <Scene furniture={furniture} />
      <Toolbar />
      <FurniturePanel onAdd={handleAddFurniture} />
      <LayoutControls furniture={furniture} onLoad={handleLoadLayout} />

      <div className="pointer-events-none absolute left-4 top-20 z-20 sm:top-4 sm:left-44">
        <h1 className="text-2xl font-semibold tracking-tight text-[#7ddf64] sm:text-3xl">
          Solarpunk Interiors
        </h1>
        <p className="text-sm text-zinc-300">Immersive 3D Design Explorer</p>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-20 text-right text-[11px] text-zinc-300 sm:text-xs">
        <p>Drag: orbit</p>
        <p>Scroll: zoom</p>
        <p>Right-drag: pan</p>
      </div>
    </main>
  );
}
