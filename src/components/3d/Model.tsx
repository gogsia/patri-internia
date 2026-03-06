'use client';

import { useModelLoader } from '@/hooks/useModelLoader';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ModelProps {
  path: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export default function Model({
  path,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: ModelProps) {
  const { scene } = useModelLoader(path);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.rotation.set(...rotation);
    }
  }, [position, scale, rotation]);

  return <primitive ref={groupRef} object={scene.clone()} />;
}
