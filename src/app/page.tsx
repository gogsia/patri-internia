'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Scene from '@/components/Scene';
import FurniturePanel from '@/components/ui/FurniturePanel';
import Toolbar from '@/components/ui/Toolbar';
import LayoutControls from '@/components/ui/LayoutControls';
import Toast from '@/components/ui/Toast';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import MaterialPicker from '@/components/ui/MaterialPicker';
import SaveTemplateModal from '@/components/ui/SaveTemplateModal';
import LayoutTemplates from '@/components/ui/LayoutTemplates';
import ColorSchemes from '@/components/ui/ColorSchemes';
import { useHistory } from '@/hooks/useHistory';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useFurnitureKeyboard } from '@/hooks/useFurnitureKeyboard';
import { useArrowKeyMovement } from '@/hooks/useArrowKeyMovement';
import { useRotationControls } from '@/hooks/useRotationControls';
import { useScalingControls } from '@/hooks/useScalingControls';
import { useToast } from '@/hooks/useToast';
import { useMaterialPicker } from '@/hooks/useMaterialPicker';
import { useLayoutSuggestions } from '@/hooks/useLayoutSuggestions';
import { useCustomTemplates } from '@/hooks/useCustomTemplates';
import {
  autoArrangeFurniture,
  cloneTemplateFurniture,
  remixFurniture,
} from '@/lib/layoutTemplates';
import { getFurnitureCategory, type ColorScheme } from '@/lib/colorSchemes';
import type { FurnitureItem, LayoutTemplate, RoomLayout } from '@/types';

export default function Home() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [designerModelUrl, setDesignerModelUrl] = useState<string | null>(null);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const history = useHistory();
  // Ref used to skip history push during arrow-key movement; committed on keyup instead
  const skipHistoryRef = useRef(false);
  // Always-current furniture ref for use in callbacks without stale closure issues
  const furnitureRef = useRef(furniture);
  furnitureRef.current = furniture;
  const toast = useToast();
  const materialPicker = useMaterialPicker();
  const { suggestions } = useLayoutSuggestions(furniture);
  const { customTemplates, saveTemplate, deleteTemplate, isLoaded } =
    useCustomTemplates();

  // Push to history whenever furniture changes, unless arrow-key movement is in flight
  useEffect(() => {
    if (!skipHistoryRef.current) {
      history.push(furniture);
    }
  }, [furniture, history]);

  // Undo handler
  const handleUndo = useCallback(() => {
    const prevState = history.undo();
    if (prevState !== null) {
      setFurniture(prevState);
      setSelectedId(null);
    }
  }, [history]);

  // Redo handler
  const handleRedo = useCallback(() => {
    const nextState = history.redo();
    if (nextState !== null) {
      setFurniture(nextState);
      setSelectedId(null);
    }
  }, [history]);

  // Add furniture from library
  const handleAddFurniture = useCallback((item: FurnitureItem) => {
    const newItem: FurnitureItem = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      position: [0, 0, 0],
    };
    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  }, []);
  // Apply material to selected furniture
  const handleMaterialSelect = useCallback(
    (materialName: string) => {
      if (!selectedId) return;

      setFurniture((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, materialName } : item
        )
      );
      toast.success(`Material changed to ${materialName}`);
    },
    [selectedId, toast]
  );

  // Delete selected furniture
  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  // Duplicate selected furniture
  const handleDuplicate = useCallback(() => {
    if (!selectedId) return;
    const selected = furniture.find((item) => item.id === selectedId);
    if (!selected) return;

    const newItem: FurnitureItem = {
      ...selected,
      id: `${selected.id.split('-')[0]}-${Date.now()}`,
      position: [
        selected.position[0] + 1,
        selected.position[1],
        selected.position[2] + 1,
      ] as [number, number, number],
    };
    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  }, [selectedId, furniture]);

  // Clear all furniture
  const handleClear = useCallback(() => {
    setFurniture([]);
    setSelectedId(null);
  }, []);

  // Deselect furniture
  const handleDeselect = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Move furniture handler (during drag)
  const handleFurnitureMove = useCallback(
    (id: string, nextPosition: [number, number, number]) => {
      setFurniture((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, position: nextPosition } : item
        )
      );
    },
    []
  );

  // Move end handler (after drag completes)
  const handleFurnitureMoveEnd = useCallback(
    (id: string, finalPosition: [number, number, number]) => {
      setFurniture((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, position: finalPosition } : item
        )
      );
    },
    []
  );

  // Load layout from storage
  const handleLoadLayout = useCallback(
    (layout: RoomLayout) => {
      setFurniture(layout.furniture);
      setDesignerModelUrl(layout.designerModelUrl || null);
      setSelectedId(null);
      toast.success(`Loaded layout: ${layout.name}`);
    },
    [toast]
  );

  const handleApplyTemplate = useCallback(
    (template: LayoutTemplate) => {
      setFurniture(cloneTemplateFurniture(template));
      setSelectedId(null);
      toast.success(`Applied template: ${template.name}`);
    },
    [toast]
  );

  const handleAutoArrange = useCallback(() => {
    if (furniture.length === 0) return;
    setFurniture(autoArrangeFurniture(furniture));
    setSelectedId(null);
    toast.success('Auto-arranged current furniture');
  }, [furniture, toast]);

  const handleRemix = useCallback(() => {
    if (furniture.length === 0) return;
    setFurniture(remixFurniture(furniture));
    setSelectedId(null);
    toast.success('Remixed current layout');
  }, [furniture, toast]);

  // Arrow key movement (0.5 unit per press)
  // Sets skipHistoryRef so rapid keypresses don't flood history; committed on keyup
  const handleArrowKeyMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!selectedId) return;

      const selected = furnitureRef.current.find((item) => item.id === selectedId);
      if (!selected) return;

      skipHistoryRef.current = true;

      const moveAmount = 0.5;
      const newPosition: [number, number, number] = [...selected.position];

      switch (direction) {
        case 'up':
          newPosition[2] -= moveAmount; // Move forward (negative Z)
          break;
        case 'down':
          newPosition[2] += moveAmount; // Move backward (positive Z)
          break;
        case 'left':
          newPosition[0] -= moveAmount; // Move left (negative X)
          break;
        case 'right':
          newPosition[0] += moveAmount; // Move right (positive X)
          break;
      }

      setFurniture((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, position: newPosition } : item
        )
      );
    },
    [selectedId]
  );

  // Commit a single history entry when the arrow key is released
  const handleArrowKeyMoveEnd = useCallback(() => {
    skipHistoryRef.current = false;
    history.push(furnitureRef.current);
  }, [history]);

  // Rotation control (15 degrees per press)
  const handleRotate = useCallback(
    (direction: 'clockwise' | 'counterclockwise') => {
      if (!selectedId) return;

      const selected = furniture.find((item) => item.id === selectedId);
      if (!selected) return;

      const rotationAmount = Math.PI / 12; // 15 degrees in radians
      let newRotation: [number, number, number] = [...selected.rotation];

      // Rotate around Y-axis (vertical rotation)
      if (direction === 'clockwise') {
        newRotation[1] += rotationAmount;
      } else {
        newRotation[1] -= rotationAmount;
      }

      setFurniture((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, rotation: newRotation } : item
        )
      );
    },
    [selectedId, furniture]
  );

  // Scaling control (10% per press, 0.5 - 3.0 range)
  const handleScale = useCallback(
    (direction: 'up' | 'down') => {
      if (!selectedId) return;

      const selected = furniture.find((item) => item.id === selectedId);
      if (!selected) return;

      const scaleMultiplier = direction === 'up' ? 1.1 : 1 / 1.1; // 1.1 for up, 1/1.1 for down
      const newScale = Math.max(
        0.5,
        Math.min(3, selected.scale * scaleMultiplier)
      );

      setFurniture((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, scale: newScale } : item
        )
      );
    },
    [selectedId, furniture]
  );

  // Save current layout as custom template
  const handleSaveTemplate = useCallback(
    (name: string, description: string, category: any) => {
      const template = saveTemplate(name, description, category, furniture);
      setShowSaveTemplateModal(false);
      toast.success(`Template saved: ${name}`);
    },
    [furniture, saveTemplate, toast]
  );

  // Delete custom template
  const handleDeleteCustomTemplate = useCallback(
    (templateId: string) => {
      deleteTemplate(templateId);
      toast.success('Template deleted');
    },
    [deleteTemplate, toast]
  );

  // Apply color scheme to all furniture
  const handleApplyColorScheme = useCallback(
    (scheme: ColorScheme) => {
      if (furniture.length === 0) return;

      setFurniture((prev) =>
        prev.map((item) => {
          const category = getFurnitureCategory(item.name);
          const materialName =
            scheme.materials[category] ||
            scheme.materials.default ||
            item.materialName;
          return { ...item, materialName };
        })
      );

      toast.success(`Applied ${scheme.name} color scheme`);
    },
    [furniture, toast]
  );

  // Keyboard shortcuts
  useUndoRedo({ onUndo: handleUndo, onRedo: handleRedo });
  useFurnitureKeyboard({
    onDelete: handleDelete,
    onDeselect: handleDeselect,
    onDuplicate: handleDuplicate,
  });
  useArrowKeyMovement({
    onMove: handleArrowKeyMove,
    onMoveEnd: handleArrowKeyMoveEnd,
    selectedId,
  });
  useRotationControls({
    onRotate: handleRotate,
    selectedId,
  });
  useScalingControls({
    onScale: handleScale,
    selectedId,
  });

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Scene
        furniture={furniture}
        selectedId={selectedId}
        designerModelUrl={designerModelUrl}
        onSelectChange={setSelectedId}
        onFurnitureMove={handleFurnitureMove}
        onFurnitureMoveEnd={handleFurnitureMoveEnd}
        onDesignerModelReady={(url) => {
          setDesignerModelUrl(url);
          toast.success('3D model generated successfully!');
        }}
        onClearDesignerModel={() => setDesignerModelUrl(null)}
      />

      <Toolbar
        selectedId={selectedId}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        canClear={furniture.length > 0}
        hasFurniture={furniture.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onClear={handleClear}
        onMaterialPicker={materialPicker.openPicker}
        onSaveTemplate={() => setShowSaveTemplateModal(true)}
      />

      <FurniturePanel onAdd={handleAddFurniture} />

      <LayoutControls
        furniture={furniture}
        designerModelUrl={designerModelUrl}
        onLoad={handleLoadLayout}
        onSaveSuccess={() => toast.success('Layout saved successfully!')}
      />

      <LayoutTemplates
        suggestedTemplateIds={suggestions.map((template) => template.id)}
        customTemplates={customTemplates}
        onApplyTemplate={handleApplyTemplate}
        onDeleteTemplate={handleDeleteCustomTemplate}
        onAutoArrange={handleAutoArrange}
        onRemix={handleRemix}
        hasFurniture={furniture.length > 0}
      />

      <ColorSchemes
        onApplyScheme={handleApplyColorScheme}
        hasFurniture={furniture.length > 0}
      />

      {materialPicker.isPickerOpen && selectedId && (
        <MaterialPicker
          currentMaterial={
            furniture.find((item) => item.id === selectedId)?.materialName
          }
          onMaterialSelect={handleMaterialSelect}
          onClose={materialPicker.closePicker}
        />
      )}

      {toast.toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => toast.dismiss(t.id)}
        />
      ))}

      <KeyboardShortcuts />

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-xs text-gray-400">
        <p>Drag to move • Arrows for position • Q/E rotate • +/- scale</p>
        <p className="mt-1">Delete/Esc/Ctrl+D • Ctrl+Z/Y for undo/redo</p>
      </div>

      {isLoaded && (
        <SaveTemplateModal
          isOpen={showSaveTemplateModal}
          onClose={() => setShowSaveTemplateModal(false)}
          onSave={handleSaveTemplate}
          furnitureCount={furniture.length}
        />
      )}
    </main>
  );
}
