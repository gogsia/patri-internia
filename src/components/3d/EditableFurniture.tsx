'use client';

import {
  memo,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
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

type EditableFurnitureNodeProps = {
  item: FurnitureItem;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  draggingId: string | null;
  dragOffset: RefObject<THREE.Vector3>;
  onSelectChange: (id: string | null) => void;
  onMove: (id: string, nextPosition: [number, number, number]) => void;
  onMoveEnd: (id: string, finalPosition: [number, number, number]) => void;
  onDragStateChange: (dragging: boolean) => void;
  setDraggingId: Dispatch<SetStateAction<string | null>>;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
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

const EditableFurnitureNode = memo(function EditableFurnitureNode({
  item,
  isSelected,
  isHovered,
  isDragging,
  draggingId,
  dragOffset,
  onSelectChange,
  onMove,
  onMoveEnd,
  onDragStateChange,
  setDraggingId,
  setHoveredId,
}: Readonly<EditableFurnitureNodeProps>) {
  const furnitureType = getFurnitureType(item);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
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

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (draggingId !== item.id) {
      return;
    }

    event.stopPropagation();
    const nextX = event.point.x - dragOffset.current.x;
    const nextZ = event.point.z - dragOffset.current.z;
    onMove(item.id, [nextX, item.position[1], nextZ]);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
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

  const handlePointerCancel = (event: ThreeEvent<PointerEvent>) => {
    if (draggingId !== item.id) return;
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

  const handlePointerEnter = () => {
    setHoveredId(item.id);
  };

  const handlePointerLeave = () => {
    setHoveredId(null);
  };

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <FurnitureGeometry
        type={furnitureType}
        scale={item.scale}
        isSelected={isSelected}
        materialName={item.materialName}
      />

      {isSelected && (
        <>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6 * item.scale, 0.75 * item.scale, 32]} />
            <meshBasicMaterial color="#b6ff99" transparent opacity={0.6} />
          </mesh>

          <mesh
            position={[0, 0.03, 0.8 * item.scale]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.15 * item.scale, 0.25 * item.scale, 3]} />
            <meshBasicMaterial color="#d4ff99" transparent opacity={0.8} />
          </mesh>
        </>
      )}

      {isHovered && !isSelected && !isDragging && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65 * item.scale, 0.75 * item.scale, 32]} />
          <meshBasicMaterial color="#7ddf64" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
});

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

  return (
    <group>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const isHovered = hoveredId === item.id;
        const isDragging = draggingId === item.id;

        return (
          <EditableFurnitureNode
            key={item.id}
            item={item}
            isSelected={isSelected}
            isHovered={isHovered}
            isDragging={isDragging}
            draggingId={draggingId}
            dragOffset={dragOffset}
            onSelectChange={onSelectChange}
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onDragStateChange={onDragStateChange}
            setDraggingId={setDraggingId}
            setHoveredId={setHoveredId}
          />
        );
      })}
    </group>
  );
}
