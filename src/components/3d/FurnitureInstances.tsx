'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { FurnitureItem } from '@/types';

type FurnitureInstancesProps = {
  items: FurnitureItem[];
};

export default function FurnitureInstances({ items }: Readonly<FurnitureInstancesProps>) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }

    items.forEach((item, index) => {
      tmp.position.set(...item.position);
      tmp.rotation.set(...item.rotation);
      tmp.scale.set(item.scale, item.scale, item.scale);
      tmp.updateMatrix();
      meshRef.current?.setMatrixAt(index, tmp.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [items, tmp]);

  if (items.length === 0) {
    return null;
  }

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, items.length]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#86c26f" metalness={0.1} roughness={0.7} />
    </instancedMesh>
  );
}
