'use client';

import { useEffect } from 'react';

const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

interface ArrowKeyMovementHandlers {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onMoveEnd?: () => void;
  selectedId: string | null;
}

export function useArrowKeyMovement({
  onMove,
  onMoveEnd,
  selectedId,
}: ArrowKeyMovementHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only move if something is selected
      if (!selectedId) return;

      // Don't interfere with text inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Arrow key movements
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        onMove('up');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        onMove('down');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onMove('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onMove('right');
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!selectedId || !onMoveEnd) return;
      if (ARROW_KEYS.has(event.key)) {
        onMoveEnd();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    globalThis.addEventListener('keyup', handleKeyUp);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      globalThis.removeEventListener('keyup', handleKeyUp);
    };
  }, [onMove, onMoveEnd, selectedId]);
}
