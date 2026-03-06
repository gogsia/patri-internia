import { useContext, createContext, useState, useCallback, type ReactNode } from 'react';
import type { FurnitureItem } from '@/types';

type HistoryEntry = {
  furniture: FurnitureItem[];
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
  return JSON.parse(JSON.stringify(items)) as FurnitureItem[];
}

export function HistoryProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [history, setHistory] = useState<HistoryData>({ entries: [], index: -1 });

  const push = useCallback((furniture: FurnitureItem[]) => {
    setHistory((prev) => {
      const snapshot = cloneFurniture(furniture);
      const trimmed = prev.entries.slice(0, prev.index + 1);
      const last = trimmed.at(-1);

      if (last && JSON.stringify(last.furniture) === JSON.stringify(snapshot)) {
        return prev;
      }

      const nextEntries = [...trimmed, { furniture: snapshot }].slice(-50);
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

  return (
    <HistoryContext.Provider
      value={{
        push,
        undo,
        redo,
        canUndo: history.index > 0,
        canRedo: history.index >= 0 && history.index < history.entries.length - 1,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
