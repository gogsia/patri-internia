'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState } from 'react';
import RoomEnvironment from './RoomEnvironment';

export default function SolarpunkRoom() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="w-full h-screen"
    >
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#d4af37" />
      <pointLight position={[10, 15, 10]} intensity={1.5} color="#7ddf64" />
      <directionalLight position={[-10, 10, 5]} intensity={0.8} color="#ffffff" />

      {/* Scene Content */}
      <Suspense fallback={null}>
        <RoomEnvironment />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
}
