import { useContext, createContext, useState, useCallback, ReactNode } from 'react';
import type { FurnitureItem } from '@/types';

interface HistoryState {
  furniture: FurnitureItem[];
}

interface HistoryContextValue {
  push: (state: FurnitureItem[]) => void;
  undo: () => FurnitureItem[] | null;
  redo: () => FurnitureItem[] | null;
  canUndo: boolean;
  canRedo: boolean;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const push = useCallback((furniture: FurnitureItem[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ furniture: JSON.parse(JSON.stringify(furniture)) });
      return newHistory.slice(-50); // Keep last 50 states
    });
    setCurrentIndex((prev) => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return JSON.parse(JSON.stringify(history[currentIndex - 1].furniture));
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return JSON.parse(JSON.stringify(history[currentIndex + 1].furniture));
    }
    return null;
  }, [currentIndex, history]);

  return (
    <HistoryContext.Provider
      value={{
        push,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
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
