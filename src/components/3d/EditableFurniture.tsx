'use client';

import { useRef, useState } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { FurnitureItem } from '@/types';

type EditableFurnitureProps = {
  items: FurnitureItem[];
  onMove: (id: string, nextPosition: [number, number, number]) => void;
  onDragStateChange: (dragging: boolean) => void;
};

export default function EditableFurniture({
  items,
  onMove,
  onDragStateChange,
}: Readonly<EditableFurnitureProps>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef(new THREE.Vector3());

  const handlePointerDown = (event: ThreeEvent<PointerEvent>, item: FurnitureItem) => {
    event.stopPropagation();
    setSelectedId(item.id);
    setDraggingId(item.id);
    onDragStateChange(true);

    dragOffset.current.set(
      event.point.x - item.position[0],
      0,
      event.point.z - item.position[2]
    );

    const eventTarget = event.target as EventTarget | null;
    if (
      eventTarget &&
      'setPointerCapture' in eventTarget &&
      typeof eventTarget.setPointerCapture === 'function'
    ) {
      eventTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>, item: FurnitureItem) => {
    if (draggingId !== item.id) {
      return;
    }

    event.stopPropagation();
    const nextX = event.point.x - dragOffset.current.x;
    const nextZ = event.point.z - dragOffset.current.z;
    onMove(item.id, [nextX, item.position[1], nextZ]);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>, item: FurnitureItem) => {
    if (draggingId !== item.id) {
      return;
    }

    event.stopPropagation();
    setDraggingId(null);
    onDragStateChange(false);

    const eventTarget = event.target as EventTarget | null;
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
        return (
          <mesh
            key={item.id}
            position={item.position}
            rotation={item.rotation}
            onPointerDown={(event) => handlePointerDown(event, item)}
            onPointerMove={(event) => handlePointerMove(event, item)}
            onPointerUp={(event) => handlePointerUp(event, item)}
          >
            <boxGeometry args={[0.8 * item.scale, 0.8 * item.scale, 0.8 * item.scale]} />
            <meshStandardMaterial
              color={isSelected ? '#b6ff99' : '#86c26f'}
              emissive={isSelected ? '#2f6d25' : '#000000'}
              emissiveIntensity={isSelected ? 0.25 : 0}
              metalness={0.1}
              roughness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}
