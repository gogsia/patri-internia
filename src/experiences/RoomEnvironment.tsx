'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function RoomEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);
  const wallRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Floor - Reflective green solarpunk surface */}
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          scale={1.5}
          color="#1a3a1a"
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>

      {/* Back wall - Eco-toned backdrop */}
      <mesh position={[0, 5, -8]} ref={wallRef}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#2d5016" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Ceiling - Dark solarpunk */}
      <mesh position={[0, 12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
      </mesh>

      {/* Solar panel accent - Bioluminescent glow */}
      <mesh position={[6, 8, -6]} scale={[2, 2, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00cc00"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Plant placeholder sphere - Green bioluminescent */}
      <mesh position={[-5, 3, 2]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#4a7c59"
          emissive="#7ddf64"
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}
