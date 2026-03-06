'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Pixelation } from '@react-three/postprocessing';
import { Leva } from 'leva';
import { Suspense } from 'react';
import { useSceneControls } from '@/components/leva/SceneControls';
import FurnitureInstances from '@/components/3d/FurnitureInstances';
import type { FurnitureItem } from '@/types';
import RoomEnvironment from './RoomEnvironment';

type SolarpunkRoomProps = {
  furniture?: FurnitureItem[];
};

export default function SolarpunkRoom({ furniture = [] }: Readonly<SolarpunkRoomProps>) {
  const controls = useSceneControls();

  return (
    <>
      <Leva collapsed oneLineLabels />
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="h-screen w-full"
      >
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={controls.ambientIntensity} color={controls.ambientColor} />
        <pointLight
          position={[10, 15, 10]}
          intensity={controls.pointLightIntensity}
          color={controls.pointLightColor}
        />
        <directionalLight position={[-10, 10, 5]} intensity={0.8} color="#ffffff" />

        {/* Scene Content */}
        <Suspense fallback={null}>
          <RoomEnvironment />
        </Suspense>

        {/* Phase 6 optimization: render furniture with one instanced draw call */}
        <FurnitureInstances items={furniture} />

        {/* Pixelated post-processing */}
        {controls.enablePixelation ? (
          <EffectComposer>
            <Pixelation granularity={controls.pixelSize} />
          </EffectComposer>
        ) : null}

        {/* Controls */}
        <OrbitControls
          autoRotate={controls.autoRotate}
          autoRotateSpeed={controls.autoRotateSpeed}
          enableZoom
          enablePan
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </>
  );
}
