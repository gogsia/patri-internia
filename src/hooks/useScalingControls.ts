'use client';

import { useEffect } from 'react';

interface ScalingControlHandlers {
  onScale: (direction: 'up' | 'down') => void;
  selectedId: string | null;
}

export function useScalingControls({
  onScale,
  selectedId,
}: ScalingControlHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only scale if something is selected
      if (!selectedId) return;

      // Don't interfere with text inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // + key = scale up, - key = scale down
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        onScale('up');
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        onScale('down');
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onScale, selectedId]);
}
