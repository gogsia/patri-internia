'use client';

import { useEffect } from 'react';

interface RotationControlHandlers {
  onRotate: (direction: 'clockwise' | 'counterclockwise') => void;
  selectedId: string | null;
}

export function useRotationControls({
  onRotate,
  selectedId,
}: RotationControlHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only rotate if something is selected
      if (!selectedId) return;

      // Don't interfere with text inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Q = counterclockwise, E = clockwise (WASD-adjacent)
      if (event.key === 'q' || event.key === 'Q') {
        event.preventDefault();
        onRotate('counterclockwise');
      } else if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();
        onRotate('clockwise');
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onRotate, selectedId]);
}
