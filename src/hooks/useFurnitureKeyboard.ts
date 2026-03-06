'use client';

import { useEffect } from 'react';

interface KeyboardHandlers {
  onDelete: () => void;
  onDeselect: () => void;
  onDuplicate?: () => void;
}

export function useFurnitureKeyboard({
  onDelete,
  onDeselect,
  onDuplicate = () => {},
}: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        event.preventDefault();
        onDelete();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        onDuplicate();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onDeselect();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onDelete, onDeselect, onDuplicate]);
}
