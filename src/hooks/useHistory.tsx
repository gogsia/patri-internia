import {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { FurnitureItem } from '@/types';

type HistoryEntry = {
  furniture: FurnitureItem[];
  signature: string;
};

type HistoryData = {
  entries: HistoryEntry[];
  index: number;
};

interface HistoryContextValue {
  push: (state: FurnitureItem[]) => void;
  undo: () => FurnitureItem[] | null;
  redo: () => FurnitureItem[] | null;
  canUndo: boolean;
  canRedo: boolean;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

function cloneFurniture(items: FurnitureItem[]): FurnitureItem[] {
  return items.map((item) => ({
    ...item,
    position: [...item.position] as [number, number, number],
    rotation: [...item.rotation] as [number, number, number],
  }));
}

function getFurnitureSignature(items: FurnitureItem[]): string {
  return items
    .map((item) => {
      const type = item.type ?? '';
      const material = item.materialName ?? '';
      return [
        item.id,
        item.name,
        type,
        item.modelPath,
        item.scale,
        material,
        item.position.join(','),
        item.rotation.join(','),
      ].join('~');
    })
    .join('|');
}

export function HistoryProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [history, setHistory] = useState<HistoryData>({
    entries: [{ furniture: [], signature: '' }],
    index: 0,
  });

  const push = useCallback((furniture: FurnitureItem[]) => {
    setHistory((prev) => {
      const signature = getFurnitureSignature(furniture);
      const trimmed = prev.entries.slice(0, prev.index + 1);
      const last = trimmed.at(-1);

      if (last?.signature === signature) {
        return prev;
      }

      const snapshot = cloneFurniture(furniture);
      const nextEntries = [
        ...trimmed,
        { furniture: snapshot, signature },
      ].slice(-50);
      return {
        entries: nextEntries,
        index: nextEntries.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    let result: FurnitureItem[] | null = null;

    setHistory((prev) => {
      if (prev.index <= 0) {
        return prev;
      }

      const nextIndex = prev.index - 1;
      result = cloneFurniture(prev.entries[nextIndex].furniture);
      return { ...prev, index: nextIndex };
    });

    return result;
  }, []);

  const redo = useCallback(() => {
    let result: FurnitureItem[] | null = null;

    setHistory((prev) => {
      if (prev.index >= prev.entries.length - 1) {
        return prev;
      }

      const nextIndex = prev.index + 1;
      result = cloneFurniture(prev.entries[nextIndex].furniture);
      return { ...prev, index: nextIndex };
    });

    return result;
  }, []);

  const value = useMemo(
    () => ({
      push,
      undo,
      redo,
      canUndo: history.index > 0,
      canRedo: history.index < history.entries.length - 1,
    }),
    [push, undo, redo, history.index, history.entries.length]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
