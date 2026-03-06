'use client';

import Scene from '@/components/Scene';
import FurniturePanel from '@/components/ui/FurniturePanel';
import LayoutControls from '@/components/ui/LayoutControls';
import Toolbar from '@/components/ui/Toolbar';
import type { FurnitureItem, RoomLayout } from '@/types';
import { useState, useCallback } from 'react';
import { useFurnitureKeyboard } from '@/hooks/useFurnitureKeyboard';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { HistoryProvider, useHistory } from '@/hooks/useHistory';

function HomeContent() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const history = useHistory();

  const commitFurniture = useCallback(
    (updater: (prev: FurnitureItem[]) => FurnitureItem[]) => {
      setFurniture((prev) => {
        const next = updater(prev);
        history.push(next);
        return next;
      });
    },
    [history]
  );

  useFurnitureKeyboard({
    onDelete: () => {
      if (!selectedId) {
        return;
      }
      commitFurniture((prev) => prev.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    },
    onDuplicate: () => {
      if (!selectedId) {
        return;
      }

      commitFurniture((prev) => {
        const selected = prev.find((item) => item.id === selectedId);
        if (!selected) {
          return prev;
        }

        const duplicated: FurnitureItem = {
          ...selected,
          id: `${selected.id}-copy-${Date.now()}`,
          position: [selected.position[0] + 0.9, selected.position[1], selected.position[2] + 0.9],
        };

        return [...prev, duplicated];
      });
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
    commitFurniture((prev) => [
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
    history.push(layout.furniture);
    setFurniture(layout.furniture);
  };

  const handleFurnitureMove = (id: string, nextPosition: [number, number, number]) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position: nextPosition } : item))
    );
  };

  const handleFurnitureMoveEnd = (id: string, finalPosition: [number, number, number]) => {
    commitFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position: finalPosition } : item))
    );
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111815]">
      <Scene
        furniture={furniture}
        selectedId={selectedId}
        onSelectChange={setSelectedId}
        onFurnitureMove={handleFurnitureMove}
        onFurnitureMoveEnd={handleFurnitureMoveEnd}
      />
      <Toolbar
        selectedId={selectedId}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        canClear={furniture.length > 0}
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
          if (!selectedId) {
            return;
          }
          commitFurniture((prev) => prev.filter((item) => item.id !== selectedId));
          setSelectedId(null);
        }}
        onDuplicate={() => {
          if (!selectedId) {
            return;
          }

          commitFurniture((prev) => {
            const selected = prev.find((item) => item.id === selectedId);
            if (!selected) {
              return prev;
            }

            const duplicated: FurnitureItem = {
              ...selected,
              id: `${selected.id}-copy-${Date.now()}`,
              position: [
                selected.position[0] + 0.9,
                selected.position[1],
                selected.position[2] + 0.9,
              ],
            };

            return [...prev, duplicated];
          });
        }}
        onClear={() => {
          if (furniture.length === 0) {
            return;
          }

          const confirmed = window.confirm('Clear all furniture from this scene?');
          if (!confirmed) {
            return;
          }

          commitFurniture(() => []);
          setSelectedId(null);
        }}
      />
      <FurniturePanel onAdd={handleAddFurniture} />
      <LayoutControls furniture={furniture} onLoad={handleLoadLayout} />

      <div className="pointer-events-none absolute left-4 top-20 z-20 sm:left-44 sm:top-4">
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
