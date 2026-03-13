import { useCallback, useState } from 'react';
import { getLayouts, saveLayout, removeLayout } from '@/lib/storage';
import type { RoomLayout } from '@/types';

export function useLayouts() {
  const [layouts, setLayouts] = useState<Record<string, RoomLayout>>(getLayouts);

  const save = useCallback((layout: RoomLayout) => {
    setLayouts(saveLayout(layout));
  }, []);

  const remove = useCallback((layoutId: string) => {
    setLayouts(removeLayout(layoutId));
  }, []);

  return { layouts, save, remove };
}
