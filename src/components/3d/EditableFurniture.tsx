'use client';

import { useRef, useState } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { FurnitureItem } from '@/types';
import { FurnitureGeometry } from './FurnitureGeometries';

type EditableFurnitureProps = {
  items: FurnitureItem[];
  selectedId: string | null;
  onSelectChange: (id: string | null) => void;
  onMove: (id: string, nextPosition: [number, number, number]) => void;
  onMoveEnd: (id: string, finalPosition: [number, number, number]) => void;
  onDragStateChange: (dragging: boolean) => void;
};

// Resolve geometry type for a furniture item.
// Priority: explicit `type` field → id substring (backward compat) → name substring (templates/old saves)
function getFurnitureType(
  item: FurnitureItem
): 'plant' | 'panel' | 'tower' | 'chair' | 'table' | 'lamp' | 'default' {
  if (item.type) return item.type;

  const id = item.id;
  if (id.includes('plant-')) return 'plant';
  if (id.includes('panel-')) return 'panel';
  if (id.includes('hydro-') || id.includes('tower')) return 'tower';
  if (id.includes('chair-')) return 'chair';
  if (id.includes('table-')) return 'table';
  if (id.includes('lamp-')) return 'lamp';

  const name = item.name.toLowerCase();
  if (name.includes('succulent') || name.includes('plant')) return 'plant';
  if (name.includes('panel')) return 'panel';
  if (name.includes('tower')) return 'tower';
  if (name.includes('chair')) return 'chair';
  if (name.includes('table')) return 'table';
  if (name.includes('lamp')) return 'lamp';

  return 'default';
}

export default function EditableFurniture({
  items,
  selectedId,
  onSelectChange,
  onMove,
  onMoveEnd,
  onDragStateChange,
}: Readonly<EditableFurnitureProps>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dragOffset = useRef(new THREE.Vector3());

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>,
    item: FurnitureItem
  ) => {
    event.stopPropagation();
    onSelectChange(item.id);
    setDraggingId(item.id);
    onDragStateChange(true);

    dragOffset.current.set(
      event.point.x - item.position[0],
      0,
      event.point.z - item.position[2]
    );

    const eventTarget = event.target;
    if (
      eventTarget &&
      'setPointerCapture' in eventTarget &&
      typeof eventTarget.setPointerCapture === 'function'
    ) {
      eventTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (
    event: ThreeEvent<PointerEvent>,
    item: FurnitureItem
  ) => {
    if (draggingId !== item.id) {
      return;
    }

    event.stopPropagation();
    const nextX = event.point.x - dragOffset.current.x;
    const nextZ = event.point.z - dragOffset.current.z;
    onMove(item.id, [nextX, item.position[1], nextZ]);
  };

  const handlePointerUp = (
    event: ThreeEvent<PointerEvent>,
    item: FurnitureItem
  ) => {
    if (draggingId !== item.id) {
      return;
    }

    event.stopPropagation();

    const finalX = event.point.x - dragOffset.current.x;
    const finalZ = event.point.z - dragOffset.current.z;
    const finalPosition: [number, number, number] = [
      finalX,
      item.position[1],
      finalZ,
    ];

    onMove(item.id, finalPosition);
    onMoveEnd(item.id, finalPosition);

    setDraggingId(null);
    onDragStateChange(false);

    const eventTarget = event.target;
    if (
      eventTarget &&
      'releasePointerCapture' in eventTarget &&
      typeof eventTarget.releasePointerCapture === 'function'
    ) {
      eventTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <group>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const isHovered = hoveredId === item.id;
        const isDragging = draggingId === item.id;
        const furnitureType = getFurnitureType(item);

        return (
          <group
            key={item.id}
            position={item.position}
            rotation={item.rotation}
            onPointerDown={(event) => {
              event.stopPropagation();
              (event as any).object.el = event.object;
              (event as any).object.el.style.cursor = 'grabbing';
              handlePointerDown(event, item);
            }}
            onPointerMove={(event) => handlePointerMove(event, item)}
            onPointerUp={(event) => {
              if ((event as any).object?.el) {
                (event as any).object.el.style.cursor = 'grab';
              }
              handlePointerUp(event, item);
            }}
            onPointerEnter={(event) => {
              setHoveredId(item.id);
              if (!isDragging) {
                (event as any).object.el = event.object;
                (event as any).object.el.style.cursor = 'grab';
              }
            }}
            onPointerLeave={(event) => {
              setHoveredId(null);
              if ((event as any).object?.el && !isDragging) {
                (event as any).object.el.style.cursor = 'default';
              }
            }}
          >
            <FurnitureGeometry
              type={furnitureType}
              scale={item.scale}
              isSelected={isSelected}
              materialName={item.materialName}
            />

            {/* Selection indicator - Glowing ring at base */}
            {isSelected && (
              <>
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry
                    args={[0.6 * item.scale, 0.75 * item.scale, 32]}
                  />
                  <meshBasicMaterial
                    color="#b6ff99"
                    transparent
                    opacity={0.6}
                  />
                </mesh>

                {/* Rotation direction indicator - Forward arrow */}
                <mesh
                  position={[0, 0.03, 0.8 * item.scale]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <coneGeometry
                    args={[0.15 * item.scale, 0.25 * item.scale, 3]}
                  />
                  <meshBasicMaterial
                    color="#d4ff99"
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </>
            )}

            {/* Hover indicator - Subtle glow */}
            {isHovered && !isSelected && (
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry
                  args={[0.65 * item.scale, 0.75 * item.scale, 32]}
                />
                <meshBasicMaterial color="#7ddf64" transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
