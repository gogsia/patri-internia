'use client';

import { Suspense } from 'react';
import Model from '@/components/3d/Model';

export default function RoomModels() {
  return (
    <group>
      {/* Placeholder for models - will be populated in Phase 3 */}
      {/* Note: Replace these paths with actual Sketchfab GLTF models when downloaded */}

      <Suspense fallback={null}>
        <Model
          path="/models/solarpunk-village.glb"
          position={[-4, 0, -8]}
          scale={0.005}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Model
          path="/models/solarpunk-building.glb"
          position={[4, 0, -6]}
          scale={0.008}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Model
          path="/models/hydroponic-tower.glb"
          position={[0, 0, 2]}
          scale={0.01}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
    </group>
  );
}
