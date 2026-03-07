import { useState } from 'react';
import type { FurnitureItem } from '@/types';

export function useMaterialPicker() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => {
    setIsPickerOpen(true);
  };

  const closePicker = () => {
    setIsPickerOpen(false);
  };

  const applyMaterial = (
    furnitureItem: FurnitureItem,
    materialName: string,
    onUpdate: (updatedItem: FurnitureItem) => void
  ) => {
    const updatedItem = {
      ...furnitureItem,
      materialName,
    };
    onUpdate(updatedItem);
  };

  return {
    isPickerOpen,
    openPicker,
    closePicker,
    applyMaterial,
  };
}
