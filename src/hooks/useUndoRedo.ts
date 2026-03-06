'use client';

import { useEffect } from 'react';

interface UndoRedoHandlers {
  onUndo: () => void;
  onRedo: () => void;
}

export function useUndoRedo({ onUndo, onRedo }: UndoRedoHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) ||
        ((event.ctrlKey || event.metaKey) && event.key === 'y')
      ) {
        event.preventDefault();
        onRedo();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo]);
}
