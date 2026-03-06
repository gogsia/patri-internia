'use client';

import Scene from '@/components/Scene';
import FurniturePanel from '@/components/ui/FurniturePanel';
import LayoutControls from '@/components/ui/LayoutControls';
import Toolbar from '@/components/ui/Toolbar';
import type { FurnitureItem, RoomLayout } from '@/types';
import { useState, useEffect } from 'react';
import { useFurnitureKeyboard } from '@/hooks/useFurnitureKeyboard';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { HistoryProvider, useHistory } from '@/hooks/useHistory';

function HomeContent() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (furniture.length > 0) {
      history.push(furniture);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [furniture]);

  useFurnitureKeyboard({
    onDelete: () => {
      if (selectedId) {
        setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
        setSelectedId(null);
      }
    },
    onDeselect: () => setSelectedId(null),
  });

  useUndoRedo({
    onUndo: () => {
      const prevState = history.undo();
      if (prevState) {
        setFurniture(prevState);
        setSelectedId(null);
      }
    },
    onRedo: () => {
      const nextState = history.redo();
      if (nextState) {
        setFurniture(nextState);
        setSelectedId(null);
      }
    },
  });

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

  const handleFurnitureMove = (id: string, nextPosition: [number, number, number]) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position: nextPosition } : item))
    );
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111815]">
      <Scene
        furniture={furniture}
        selectedId={selectedId}
        onSelectChange={setSelectedId}
        onFurnitureMove={handleFurnitureMove}
      />
      <Toolbar
        selectedId={selectedId}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={() => {
          const prevState = history.undo();
          if (prevState) {
            setFurniture(prevState);
            setSelectedId(null);
          }
        }}
        onRedo={() => {
          const nextState = history.redo();
          if (nextState) {
            setFurniture(nextState);
            setSelectedId(null);
          }
        }}
        onDelete={() => {
          if (selectedId) {
            setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
            setSelectedId(null);
          }
        }}
      />
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

export default function Home() {
  return (
    <HistoryProvider>
      <HomeContent />
    </HistoryProvider>
  );
}
